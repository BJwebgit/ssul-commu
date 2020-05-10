window.onload = function(){
    var sign_up = document.getElementById('sign_up_btn');
    var login = document.getElementById('login_btn');
    sign_up.addEventListener('click', function(event){
        location.href='./Sign_Up';
    });
    login.addEventListener('click', function(event){
        location.href='../login';
    });
}

$(function () {
    $('#id').blur(function () {
        $.ajax({
            type: "POST",
            url: "/login/check_id",
            dataType: 'json',
            data: {
                "id": $('#id').val()
            },
            success: function (data) {	//data : check_id에서 넘겨준 결과값
                console.log("ajax에서 받은 값은 : " + data);
                if ($.trim(data) == '1') {
                    if ($('#id').val() != '') {
                        $("#email_id").html("사용가능합니다");
                        $("#email_id").css("color", "red");
                        $("#email_id").css("font-size", "12px");
                    }
                } 
                else if($.trim(data) == '0'){
                    $("#email_id").html("사용불가능합니다");
                    $("#email_id").css("color", "red");
                    $("#email_id").css("font-size", "12px");
                }
                
                else {
                    if ($('#id').val() != '') {
                        alert(data);
                    }
                }
            }
        })
    })
    $('#pwd').blur(function () {
        var pw = $("#pwd").val();
        var regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        if ($('#pwd').val() != ''){
            if(false === regex.test(pw)) {
                $("#pwd_length").html("8~20자 영문, 숫자, 특수문자를 모두 사용해야합니다");
                $("#pwd_length").css("color", "red");
                $("#pwd_length").css("font-size", "12px");
            }
            else if(pw.search(/\s/) != -1){
                $("#pwd_length").html("비밀번호는 공백 없이 입력해주세요");
                $("#pwd_length").css("color", "red");
                $("#pwd_length").css("font-size", "12px");
            }
            else {
                $("#pwd_length").html("");
            }
        }
    })
    $('#nick').blur(function () {
        $.ajax({
            type: "POST",
            url: "/login/check_nick",
            dataType: 'json',
            data: {
                "nick": $('#nick').val()
            },
            success: function (data) {	//data : check_id에서 넘겨준 결과값
                console.log("ajax에서 받은 값은 : " + data);
                if ($.trim(data) === '1') {
                    if ($('#nick').val() != '') {
                        $("#nick_check").html("사용가능합니다");
                        $("#nick_check").css("color", "red");
                        $("#nick_check").css("font-size", "12px");
                    }
                } 
                else if($.trim(data) === '0'){
                    $("#nick_check").html("사용불가능합니다");
                    $("#nick_check").css("color", "red");
                    $("#nick_check").css("font-size", "12px");
                }
                
                else {
                    if ($('#nick').val() != '') {
                        alert(data);
                    }
                }
            }
        })
    })
})
function isSame(){            
    var pwd = document.getElementById('pwd');
    var pwd_test = document.getElementById('pwd_test');
    var same = document.getElementById('same');

    if(pwd.value === pwd_test.value){
        same.innerHTML = '비밀번호가 일치합니다';
        same.style.color = 'blue';
        same.style.fontSize = '13px';
    }
    else if(pwd.value != pwd_test.value && pwd_test.value.length != 0){
        same.innerHTML = '비밀번호가 일치하지 않습니다';
        same.style.color = 'red';
        same.style.fontSize = '13px';
    }
    else{
        same.innerHTML = '';
    }
}