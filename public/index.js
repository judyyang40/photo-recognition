function submitInfo() {
    $.post('/submitInfo',
    {
        username: $('#first_name').val()+$('#middle_name').val()+$('#last_name').val()
    }, 
    function (data) {
        $('#show-pic').attr('src', data.imgsrc);
    });
}

function changePic(input) {
    console.log(input);
    if(input != null) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#show-pic').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
}

/*function picUpload() {
    console.log($('#uploadpic')[0].files[0]);
    var formData = new FormData($('#uploadpic')[0].files[0]);
    $.ajax({
        url: '/picUpload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log('upload successful');
        }
    })
}*/

function getPics() {
    $.get('/getPics', function(data) {
        $('#pic1').attr('src', data.pic1);
        $('#pic2').attr('src', data.pic2);
        //$('#compare-results').html(data.match);
    });
}
