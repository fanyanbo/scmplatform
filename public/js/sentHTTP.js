var xmlhttp = null;
function sendHTTPRequest(url, data, func) {
    if (xmlhttp == null) {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = func;
        xmlhttp.open("POST", url, true);
        // xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
        xmlhttp.setRequestHeader("Content-type", "application/json ;charset=utf-8");

        xmlhttp.send(data);
    }
    else {
        console.log("result is null");
    }
}