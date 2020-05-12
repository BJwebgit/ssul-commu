window.onload = function(){
    var count = 1;
    var reply_btn = document.getElementById('reply_btn');
    var reply_form = document.getElementById('reply_form');
    reply_form.style.display = "none";
    reply_btn.addEventListener('click', function(event){
        reply_form.style.display = "block";
        if(count === 1){
            reply_form.style.display = "block";
            count = 0;
        }
        else{
            reply_form.style.display = "none";
            count = 1;
        }
    });
}