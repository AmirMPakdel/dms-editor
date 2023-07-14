
function getParamByName(name, default_value = null, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return default_value;
    if (!results[2]) return default_value;
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setOnCtlKeyListener(onCtlS, onCtlD){

    var isCtrl = false;
    document.onkeyup=function(e){
        if(e.keyCode == 17) isCtrl=false;
    }

    document.onkeydown=function(e){
        if(e.keyCode == 17) isCtrl=true;
        console.log(e.keyCode+" - "+ isCtrl);
        if(e.keyCode == 83 && isCtrl == true) {
            onCtlS();
            return false;
        }else if(e.keyCode == 68 && isCtrl == true){
            onCtlD();
            return false;
        }
    }
}