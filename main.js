$(function(){
	$.get('/proxy', {url: 'www.lazada.vn/Nokia-Lumia-520-IPS4-5MP-8GB-Den-58171.html'}).done(function(){
		console.log(arguments)
	});

	$.get('/proxy', {url: 'www.lazada.vn/Apple-iPhone-5-Retina-4-8MP-16GB-Den-44541.html'}).done(function(){
		console.log(arguments)
	});
});