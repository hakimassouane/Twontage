 $('.btn-bookmark').click(function() {
 	var buttondata = $(this).data('clipinfo');
 	$.post("http://localhost:3000/bookmark",
    {
        clipObject : buttondata
    },
    function(data, status){
    	console.log("The clip was succesfully bookmarked");
    });
});