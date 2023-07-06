export function formatDate(date: Date) {
    var d = date
    var date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + (((d.getMinutes() / 5) * 5).toString().length == 2 ? ((d.getMinutes() / 5) * 5).toString() : "0" + ((d.getMinutes() / 5) * 5).toString());
    return date_format_str
}
export function getBadgeColor(status: string) {
    switch (status) {
        case "Running":
            return "green";
        case "Error":
            return "red";
        case "Freezing":
            return "blue";
        case "Frozen":
            return "blue";
        case "Restarting":
            return "yellow";
        case "Starting":
            return "darkgreen";
        case "Stopped":
            return "red";
        case "Stopping":
            return "darkred";
        default:
            return "gray";
    }
}
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}