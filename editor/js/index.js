require.config({ paths: { vs: "../node_modules/monaco-editor/min/vs" } });

document.title="ویرایشگر فایل | اداره کل فناوری اطلاعات و مدیریت هوشمند"

var editor;

var file_content = "";

var content_did_change = false;

var file_id = getParamByName("file_id");

var file_ext = getParamByName("file_ext");

var save_btn = document.getElementById("save_btn");

var preview_btn = document.getElementById("preview_btn");

var preview_window = null;

require(["vs/editor/editor.main"], function () {

    setOnCtlKeyListener(saveContent, previewContent);

    save_btn.addEventListener("click", saveContent);

    preview_btn.addEventListener("click", previewContent);

    loadContent(function (response) {

        file_content = response.data.value;

        saved_file_content = file_content;

        editor = monaco.editor.create(document.getElementById("container"), {
            value: file_content,
            language: "markdown",
            theme: "vs-dark",
            fontSize: 18,
            minimap: { enabled: false },
        });

        editor.getModel().onDidChangeContent(onContentChange);
    });
});

function loadContent(cb) {
    var params = {
        token: getCookie(env.token_cookie_name),
        file_id,
    };

    fetch(env.server_get_file_content_url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then(function(res){
        res.json().then(function(json){
            cb(json);
        }).catch(function(e){
            console.log(e);
        });
    }).catch(function(e){
        console.log(e);
    });
}

function saveContent() {

    if(!content_did_change){
        return;
    }
    content_did_change = false;

    var params = {
        token: getCookie(env.token_cookie_name),
        file_id: getParamByName("file_id"),
        value: editor.getValue(),
    };

    fetch(env.server_save_file_content_url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then(function(res){
        res.json().then(function(json){
            saved_file_content = params.value;
            showSavedMessage();
            onContentSaved();
        }).catch(function(e){
            console.log(e);
        });
    }).catch(function(e){
        console.log(e);
    });
}

function previewContent(){
    if(preview_window && preview_window.location){
        preview_window.location.reload();
        preview_window.focus();
        return;
    }
    preview_window = open(env.preview_file_url+"?id="+file_id+"&ext="+file_ext);
    preview_window.addEventListener("close", function(){
        preview_window = null;
    });
}

function showSavedMessage(){
    var saved_el = document.getElementById("saved_message");
    saved_el.style.display="block";
    setTimeout(function(saved_el){
        saved_el.style.display="none";
    }, 3000, saved_el)
}

function onContentChange(){
    var change_cricle = document.getElementById("change_cricle");
    change_cricle.style.background="white";
    content_did_change = true;
}

function onContentSaved(){
    var change_cricle = document.getElementById("change_cricle");
    change_cricle.style.background="transparent";
}