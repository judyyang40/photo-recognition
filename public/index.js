function submitInfo() {
	console.log("submitinfo");
    $.post('/submitInfo',
    {
        username: $('#userName').val()
    }, 
    function (data) {
        $('#id-pic').attr('src', data.imgsrc);
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


function getPics() {
    $.get('/getPics', function(data) {
        $('#pic1').attr('src', data.pic1);
        $('#pic2').attr('src', data.pic2);
        //$('#compare-results').html(data.match);
    });
}

function showResults() {
	//console.log("showresults"+ $('#pic'));
	
	$.post('/uploadtakepicture',
	{pic: $('#pic').val()},
	function(data) {
		console.log(data);
		$('.match-result').html(data[0].Similarity+"%   Confidence: "+ data[0].Face.Confidence);
	});
}
