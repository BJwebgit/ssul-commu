var e_mail = 0;
var pword = 0;
var t_pword = 0;
var nick_name = 0;

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
                        e_mail = 1;
                    }
                } 
                else if($.trim(data) == '0'){
                    $("#email_id").html("사용불가능합니다");
                    $("#email_id").css("color", "red");
                    $("#email_id").css("font-size", "12px");
                    e_mail = 0;
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
                pword = 0;
            }
            else if(pw.search(/\s/) != -1){
                $("#pwd_length").html("비밀번호는 공백 없이 입력해주세요");
                $("#pwd_length").css("color", "red");
                $("#pwd_length").css("font-size", "12px");
                pword = 0;
            }
            else {
                $("#pwd_length").html("");
                pword = 1;
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
                        nick_name = 1;
                    }
                } 
                else if($.trim(data) === '0'){
                    $("#nick_check").html("사용불가능합니다");
                    $("#nick_check").css("color", "red");
                    $("#nick_check").css("font-size", "12px");
                    nick_name = 0;
                }
                else {
                    if ($('#nick').val() != '') {
                        alert(data);
                        nick_name = 0;
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
        t_pword = 1;
    }
    else if(pwd.value != pwd_test.value && pwd_test.value.length != 0){
        same.innerHTML = '비밀번호가 일치하지 않습니다';
        same.style.color = 'red';
        same.style.fontSize = '13px';
        t_pword = 0;
    }
    else{
        same.innerHTML = '';
        t_pword = 0;
    }
}
function submitCheck() {
    if (e_mail === 0) {
        alert('아이디 조건이 맞지 않습니다.');
        return false;
    }
    else if (pword === 0) {
        alert('비밀번호 조건이 맞지 않습니다.');
        return false;
    } else if (t_pword === 0) {
        alert('비밀번호 확인이 일치하지 않습니다.');
        return false;
    } else if (nick_name === 0) {
        alert('닉네임 조건이 맞지 않습니다.');
        return false;
    }
    else{
        return true;
    }
}