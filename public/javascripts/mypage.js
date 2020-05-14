var pword = 0;
var t_pword = 0;
var nick_name = 0;

$(function () {
    $('#pwd').blur(function () {
        var pw = $("#pwd").val();
        var regex = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
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
                        var nick = $('#nick').val();
                        var regex = /^[a-zA-Z0-9가-힣]{3,8}$/;
                        if(regex.test(nick) === false){
                            $("#nick_check").html("3~8자 입력해주세요※특수문자 사용불가※)");
                            $("#nick_check").css("color", "red");
                            $("#nick_check").css("font-size", "12px");
                            nick_name = 0;
                        }
                        else{
                            $("#nick_check").html("사용가능합니다");
                            $("#nick_check").css("color", "red");
                            $("#nick_check").css("font-size", "12px");
                            nick_name = 1;
                        }
                    }
                    else{
                        $("#nick_check").html("필수입력사항");
                        $("#nick_check").css("color", "red");
                        $("#nick_check").css("font-size", "12px");
                        nick_name = 0;
                    }
                }
                else if ($.trim(data) === '2') {
                    nick_name = 1;
                } 
                else {
                    $("#nick_check").html("이미 사용중입니다");
                    $("#nick_check").css("color", "red");
                    $("#nick_check").css("font-size", "12px");
                    nick_name = 0;
                }
            }
        })
    })
    $('#phone').blur(function () {
        var phone = $("#phone").val();
        var regex = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

        if ($('#phone').val() != '') {
            if (false === regex.test(phone)) {
                $("#tel_check").html("전화번호 양식이 아닙니다");
                $("#tel_check").css("color", "red");
                $("#tel_check").css("font-size", "12px");
                tel = 0;
            } else {
                $("#tel_check").html("사용가능합니다");
                $("#tel_check").css("color", "red");
                $("#tel_check").css("font-size", "12px");
                tel = 1;
            }
        } 
        else {
            $("#tel_check").html("필수정보입니다");
            $("#tel_check").css("color", "red");
            $("#tel_check").css("font-size", "12px");
            tel = 0;
        }
    })
})

function noSpaceForm(obj) { // 공백사용못하게
    var str_space = /\s/;  // 공백체크
    if (str_space.exec(obj.value)) { //공백 체크
        alert("해당 항목에는 공백을 사용할수 없습니다.\n\n공백은 자동적으로 제거 됩니다.");
        obj.focus();
        obj.value = obj.value.replace(' ', ''); // 공백제거
        return false;
    }
    // onkeyup="noSpaceForm(this);" onchange="noSpaceForm(this);"
}

function checkall(obj){
    $('#nick').focus();
    $('#nick').blur();
    $('#phone').focus();
    $('#phone').blur();
}

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
    if (pword === 0) {
        alert('비밀번호 조건이 맞지 않습니다.');
        return false;
    } else if (t_pword === 0) {
        alert('비밀번호 확인이 일치하지 않습니다.');
        return false;
    } else if (nick_name === 0) {
        alert('닉네임 조건이 맞지 않습니다.');
        return false;
    } else if (tel_check === 0) {
        alert('전화번호 조건이 맞지 않습니다.');
        return false;
    }
    else{
        return true;
    }
}