(function(){
	function parseHtmlPage(url){
		var df = $.Deferred();

		$.get('/proxy', {url: url}, 'html').done(function(page, status){
			var safetyPage = page.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
				safetyPage = safetyPage.replace(/\<img .+?\/\>/gi, " ");

			var page = $(safetyPage),
				pic = page.find('#productZoom'),
				result = {};

			result.pic = pic.data().zoomImage;

			var specs = page.find('#productSpecifications')

			result.specs = {};
			specs.find('tr').each(function(i, tr){
				tr = $(tr);
				result.specs[tr.find('.strong').text().replace(/\s+/g, '___')] = tr.find('td:last-child').text();
			});


			console.log(result);

			df.resolve(result);
		});

		return df.promise();
	}

	$(function(){
		var formEl = $('.items-parser'),
			firstPic = $('.first-item-pic img'),
			secondPic = $('.second-item-pic img'),
			targetTable = $('.target'),
			targetTableTr = targetTable.find('.target-pics'),
			template = Handlebars.compile($('#tableRow').html());

		formEl.on('submit', function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			var el = $(this),
				btn = el.find('.form-button'),
				input1Val = $('#url1').val(),
				input2Val = $('#url2').val();

			btn.attr('disabled', true);

			//DEBUG
			input1Val = 'www.lazada.vn/Nokia-Lumia-520-IPS4-5MP-8GB-Den-58171.html';
			input2Val = 'www.lazada.vn/Apple-iPhone-5-Retina-4-8MP-16GB-Den-44541.html';

			$.when.apply($, [parseHtmlPage(input1Val), parseHtmlPage(input2Val)]).then(function(first, second){
				firstPic.attr('src', first.pic);
				secondPic.attr('src', second.pic);

				var templateObj = [];

				_.each(_.union(_.keys(first.specs), _.keys(second.specs)), function(key){
					templateObj.push({
						label: key.replace(/___/ig, ' '),
						val1: first.specs[key] || "-",
						val2: second.specs[key] || "-", 
					});
				});

				targetTable.find('tr:not(.target-pics)').remove();
				targetTableTr.after(template({rows: templateObj}));

				targetTable.toggleClass('hidden', false);
				btn.removeAttr('disabled');
			});
			
		});
	});
})();