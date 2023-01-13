package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/joho/godotenv"
	lxd "github.com/lxc/lxd/client"

	"time"

	"net"

	"github.com/pkg/sftp"
)

func server(c net.Conn, con lxd.InstanceServer) {
	for {
		buf := make([]byte, 512)
		nr, err := c.Read(buf)
		if err != nil {
			return
		}
		reader := bufio.NewReader(bytes.NewReader(buf[:nr]))
		req, err := http.ReadRequest(reader)

		if err != nil {
			fmt.Printf(string(err.Error()))
			return
		}

		switch req.URL.Path {
		case "/sftp":
			connection, err := con.GetInstanceFileSFTPConn(req.URL.Query().Get("instance"))
			if err != nil {
				panic(err)
			}
			path := req.URL.Query().Get("path")
			if path == "" {
				path = "/"
			}
			client, err := sftp.NewClientPipe(connection, connection)
			if err != nil {
				panic(err)
			}
			fileType := "file"
			stat, err := client.Lstat(path)
			if err != nil {
				t := &http.Response{
					Body:       ioutil.NopCloser(bytes.NewBufferString("File Does Not Exist")),
					Proto: 	"HTTP/1.1",
					ProtoMajor: 1,
					ProtoMinor: 1,
					StatusCode: 404,
					Status: "404 Not Found",				}
				t.Write(c)
				c.Close()
				return
			}

			if stat.IsDir() {
				fileType = "directory"
			} else if stat.Mode()&os.ModeSymlink == os.ModeSymlink {
				fileType = "symlink"
			}
			if fileType == "file" {
				file, err := client.Open(path)
				if err != nil {
					panic(err)
				}
				defer file.Close()
				t := &http.Response{
					Body: file,
					Header: http.Header{
						"type": []string{fileType},
					},
					Proto: 	"HTTP/1.1",
					ProtoMajor: 1,
					ProtoMinor: 1,
					StatusCode: 200,
					Status: "200 OK",
				}
				fmt.Printf("sftp")
				t.Write(c)
				c.Close()
				return
			} else if fileType == "symlink" {
				target, err := client.ReadLink(path)
				if err != nil {
					panic(err)
				}

				if target[0] == '/' {
					target = target[1:]
				}

				target, err = client.RealPath(target)
				if err != nil {
					panic(err)
				}

				t := &http.Response{
					Body: ioutil.NopCloser(bytes.NewReader([]byte(target))),
					Header: http.Header{
						"type": []string{fileType},
					},
					Proto: 	"HTTP/1.1",
					ProtoMajor: 1,
					ProtoMinor: 1,
					StatusCode: 200,
					Status: "200 OK",
				}
				t.Write(c)
				c.Close()
				return
			} else if fileType == "directory" {
				files, err := client.ReadDir(path)
				if err != nil {
					panic(err)
				}
				type item struct {
					Name    string
					Size    int64
					Mode    os.FileMode
					IsDir   bool
					ModTime time.Time
				}
				var arr []item
				for _, file := range files {
					arr = append(arr, item{
						Name:    file.Name(),
						Size:    file.Size(),
						Mode:    file.Mode(),
						IsDir:   file.IsDir(),
						ModTime: file.ModTime(),
					})
				}
				json, err := json.Marshal(arr)
				if err != nil {
					panic(err)
				}
				t := &http.Response{
					Body: ioutil.NopCloser(bytes.NewReader(json)),
					Header: http.Header{
						"type": []string{fileType},
					},
					Proto: 	"HTTP/1.1",
					ProtoMajor: 1,
					ProtoMinor: 1,
					StatusCode: 200,
					Status: "200 OK",
				}
				

				t.Write(c)
				c.Close()
				return
			}
		case "/state":
			state, _, err := con.GetInstanceState(req.URL.Query().Get("instance"))
			if err != nil {
				fmt.Printf(string(err.Error()))
			}
			json, err := json.Marshal(state)
			if err != nil {
				fmt.Print(string(err.Error()))
			}
			t := &http.Response{
				Body: ioutil.NopCloser(bytes.NewReader(json)),
				Proto: 	"HTTP/1.1",
				ProtoMajor: 1,
				ProtoMinor: 1,
				StatusCode: 200,
				Status: "200 OK",
			}
			t.Write(c)
			c.Close()
			return
		}
	}
}

func main() {
	godotenv.Load()
	fmt.Printf("Starting High-Performance Subserver\n")
	var con lxd.InstanceServer
	var lxdErr error
	cmd := "node homedir.js"
	parts := strings.Fields(cmd)
	data, err := exec.Command(parts[0], parts[1:]...).Output()
	if err != nil {
		panic(err)
	}
	homedir := strings.Replace(string(data), "\n", "", -1)
	if os.Getenv("LXD") == "" {
		con, lxdErr = lxd.ConnectLXDUnix("/var/snap/lxd/common/lxd/unix.socket", nil)

	} else {
		cert, err := os.ReadFile("./client.crt")
		if err != nil {
			panic(err)
		}
		serverCert, err := os.ReadFile(homedir + "/.config/lxc/servercerts/node.crt")
		if err != nil {
			panic(err)
		}
		key, err := os.ReadFile("./client.key")
		if err != nil {
			panic(err)
		}
		con, lxdErr = lxd.ConnectLXD(os.Getenv("LXD"), &lxd.ConnectionArgs{
			TLSServerCert: string(serverCert),
			TLSClientCert: string(cert),
			TLSClientKey:  string(key),
		})
	}
	if lxdErr != nil {
		panic(lxdErr)
	}
	if _, err := os.Stat("./lava.sock"); err == nil {
		errRM := os.Remove("./lava.sock")
		if errRM != nil {
			panic(errRM)
		}
	}
	l, err := net.Listen("unix", "./lava.sock")
	if err != nil {
		panic(err)
	}
	fmt.Printf("High performance subserver started\n")
	for {
		fd, err := l.Accept()
		if err != nil {
			panic(err)
		}
		go server(fd, con)
	}

}
