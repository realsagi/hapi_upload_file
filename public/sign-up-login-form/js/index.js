var fileReadUpload;
var fileName;
var fileType;

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

$('#getStart').on('click', function(e){
  var data = {
    firstName : $('#name').val(),
    lastName : $('#lastName').val(),
    email : $('#email').val(),
    password : $('#password').val(),
    fileBinary: fileReadUpload,
    fileName: fileName
  }
  console.log(data);
  $.post("/api/users", data,function (response){
    console.log(response);
  },function(err){
    console.log(err);
  });
});

$("#fileUpload").change(function() {
    fileName = this.files[0].name;
    fileType = this.files[0].type;
    renderImage(this.files[0])
});

function renderImage(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    fileReadUpload = event.target.result;
  }

  reader.readAsBinaryString(file);
}