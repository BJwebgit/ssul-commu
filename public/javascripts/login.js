$(function () {
    $('#id').blur(function () {
        $.ajax({
            type: "POST",
            url: "/login/check_login",
            dataType: 'json',
            data: {
                "id": $('#id').val()
            },
            success: function (data) {	//data : check_id에서 넘겨준 결과값
                console.log("ajax에서 받은 값은 : " + data);
                if ($.trim(data) === '1') {
                    if ($('#id').val() != '') {
                        $("#email_id").html("사용가능합니다");
                        $("#email_id").css("color", "red");
                        $("#email_id").css("font-size", "12px");
                        e_mail = 1;
                    }
                } 
                else if($.trim(data) === '0'){
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
})

function submitCheck() {
    $.ajax({
        type: "POST",
        url: "/login/check_login",
        dataType: 'json',
        data: {
            "id": $('#id').val()
        },
        success: function (data) {	//data : check_id에서 넘겨준 결과값
            console.log("ajax에서 받은 값은 : " + data);
            if($.trim(data) === '0'){
                alert("아이디 또는 비밀번호가 맞지 않습니다");
            }
        }
    })
}