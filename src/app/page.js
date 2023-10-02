import { Text } from "@mantine/core";

export default async function Home() {
  let res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  let data = await res.json();
  
  return (
    <>
    <Text>Welcome to Ararat!</Text>
    <Text>{data.title}</Text>
    </>
  )
}
