$( document ).ready(function(){


	$("#datepicker").datepicker({
		dateFormat: 'dd.mm.yy'
	})



	$(".label").click(function(){
		console.log("Here!")
		$(this).prev().focus()
	})


	$(".submit").click(function(e){

		

		$('#form').validate({
			rules: {
				openingDate: {
					required: true,
				},
				depositAmount: {
					required: true,
					range: [1000, 3000000]
				},
				percent: {
					required: true,
					range: [3, 100]
				},

				depositTerm: {
					required: true,
					range: $(".select__term").val() ? [1, 60] : [1, 5]
				},

			},
			messages: {
				openingDate: {
					required: 'Введите дату открытия'
				},
				depositAmount: {
					required: 'Введите сумму вклада',
					range: "Введите сумму от 1.000 до 3.000.000"
				},
				percent: {
					required: 'Введите процентную ставку',
					range: "Введите число от 3 до 100"
				},
				topUp: {
					required: "Введите ежемесячную сумму пополнения",
					range: "Введите сумму от 0 до 3.000.000"
				},

				depositTerm: {
					required: "Введите число",
					range: $(".select__term").val() ? "Введите число от 1 до 60" : "Введите число от 1 до 5"
				},
			},

			submitHandler: function(form) {

				e.preventDefault();


				// Изменение цвета инпутов
				$(".input:blank").css("border-color", "#FF5A5F")
				$("#selectTerm").css("border-color", "green")
				$(".input:filled").css("border-color", "green")



				// Отправка запроса
				$.ajax({
					dataType: "json",
					type: "post",
					url: "http://iqtask/calc.php",
					data: {
						startDate: $(".opening__date").val(),  																		// Дата открытия вклада
						sum: $(".deposit__amount").val(), 																			// Сумма вклада
						term: $(".select__term").val() == "Месяц" ? $(".deposit__term").val() : 12 * $(".deposit__term").val(),		// Срок вклада в месяцах
						percent: $(".percent").val(),																// Процентная ставка, % годовых
						sumAdd: $(".topUp__amount").val() || 0														// Сумма ежемесячного пополнения вклада
					},
					success: function(data){
						$(".text").html("Сумма к выплате");
						$("#number").html("<h1> ₽ " + data["result"] + "</h1>");
					},
					error: function(){
						console.log("Something went wrong");
					}           
				});
			},

			errorPlacement: function(error, element) {
				if(element.attr("class").split(" ")[0] == "deposit__term"){
					error.appendTo(element.parent().siblings(".error__wrapper"))
				} else {
					error.appendTo(element.siblings(".error__wrapper"));
				}
			},

			invalidHandler: function(event, validator){
				// Изменение цвета инпутов
				$(".input:blank").css("border-color", "#FF5A5F")
				$("#selectTerm").css("border-color", "#FF5A5F")
				$(".input:filled").css("border-color", "#33C4A0")
			}

		})
	})


	$('#checkbox').click(function(){
		if ($(this).is(':checked')){
			$(".topUp__wrapper").css("opacity", "1")
			$("#topUp").attr("required", true)
			$("#topUp").prop("disabled", "")
			$('#topUp').val('');

			$("#topUpLabel").css("cursor", "pointer")

		} else {
			$(".topUp__wrapper").css("opacity", "0")
			$("#topUp").attr("required", false)
			$("#topUp").prop("disabled", "disabled")
			$("#topUpLabel").css("cursor", "default")
			$('#topUp').val('0');
		}
	});



})