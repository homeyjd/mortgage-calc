(function() {

	// Tooltips
	d3.selectAll('.tooltip').each(function(el){
		var $this = d3.select(this), d;

		d = $this.append('div')
			.style('opacity', 0)
			.attr('class', 'tooltip-content')
			.html(function(){
				return $this.attr('data-content');
			});
		$this
			.attr('data-content', null)
			.on('mouseover', function() {
				d.transition().style('opacity', 1);
			})
			.on('mouseout', function() {
				d.transition().style('opacity', 0);
			});
	});


	var form = d3.select('form[name="mortgage_calc"]')
		, fields = {
			amount:          form.select('input[name=amount]'),
			amount_slider:   form.select('input[name=amount_slider]'),
			term:            form.select('input[name=term]'),
			term_slider:     form.select('input[name=term_slider]'),
			interest:        form.select('input[name=interest]'),
			interest_slider: form.select('input[name=interest_slider]')
		}
		, allFields = d3.selectAll([fields.amount.node(), fields.term.node(), fields.interest.node()])
		, allSliders = d3.selectAll([ fields.amount_slider.node(), fields.term_slider.node(), fields.interest_slider.node() ])
		;

	allFields.on('keydown', function() {
		$('#'+this.id+'_slider').value( this.value );
	});
	allSliders.on('slidechange', function(evt, ui) {
		$('#'.ui.handle.id.replace(/_slider/, '')).value( ui.value );
	});


	function recalc () {
		/*
			From: http://www.mtgprofessor.com/formulas.htm

			Calculating Fixed Monthly Payments
			The following formula is used to calculate the fixed monthly payment (P) required to fully amortize a loan of L dollars over a term of n months at a monthly interest rate of c. [If the quoted rate is 6%, for example, c is .06/12 or .005].
			P = L[c(1 + c)n]/[(1 + c)n - 1]
		*/
		// first put the value of the monthly payment into the equation
		var
			// User input
			principal = ,
			years = ,
			apr = ,
			// Convenience
			interest_rate = (apr/100/12),
			num_months = years * 12,
			// Run the calc
			monthly_payment = principal * interest_rate * (1 + interest_rate) * num_months / (((1 + interest_rate) * num_months) - 1);

		/*
			http://en.wikipedia.org/wiki/Mortgage_calculator
			OR:
		*/
		monthly_payment = interest_rate * principal / (1 - (1 + interest_rate)^(-num_months))

		/*
			The next formula is used to calculate the remaining loan balance (B) of a fixed payment loan after p months.
			B = L[(1 + c)n - (1 + c)p]/[(1 + c)n - 1]

			The APR is what economists call an "internal rate of return" (IRR), or the discount rate that equates a future stream of dollars with the present value of that stream. In the case of a home mortgage, the formula is:
			L - F = P1/(1 + i) + P2/(1 + i)2 +… (Pn + Bn)/(1 + i)n
			Where:
			i = IRR
			L = Loan amount
			F = Points and all other lender fees
			P = Monthly payment
			n = Month when the balance is paid in full
			Bn = Balance in month n
			This equation can be solved for i only through a series of successive approximations, which must be done by computer. Many calculators will also do it provided that all the values of P are the same.

			The APR is a special case of the IRR, because it assumes that the loan runs to term. In the equation, this means that n is equal to the term, and Bn is zero.

			If there is a monthly mortgage insurance premium, that premium must be included in P for as long as the balance exceeds 78% of the original property value. If there is an upfront premium, it is included in F. If the upfront premium is financed, P should be calculated based on the larger loan amount, but L should not include the premium.
		*/

		var
		// calculate using iteration how the expenses change the target date

	}

	function float(s) {
		var i = parseFloat(s);
		return (i == NaN || !i) ? 0 : i;
	}

	Number.prototype.formatMoney = function(c, d, t) {
		var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};

	var c = {

	};


/*
		var form = $('#area-form'),
			sqft = $('#area-form-sq-ft')[0],
			waste = $('#area-form-waste')[0],
			price = $('#area-form-price')[0],
			total_sqft = $('#area-form-material-req')[0],
			total_cost = $('#area-form-cost')[0];

	var rows = [],
		rowsIncrement = 1,
		Row = function (number) {
		this.template = '<tr class="area">\
			<td class="name">Area %d</td>\
			<td class="length feet"><input type="text" placeholder="0"/></td>\
			<td class="length inch"><input type="text" placeholder="0.0"/></td>\
			<td class="width feet"><input type="text" placeholder="0"/></td>\
			<td class="width inch"><input type="text" placeholder="0.0"/></td>\
			<td><button class="delete">-</button></td>\
		</tr>';
		this.template = this.template.replace(/%d/, ''+number);
		this.template = $(this.template);
		var self = this;
		this.template.find('.delete').click(function(e) {
			self.remove();
			e.preventDefault();
			return false;
		}).end();
		this.length = [ this.template.find('.length.feet input')[0], this.template.find('.length.inch input')[0] ];
		this.width = [ this.template.find('.width.feet input')[0], this.template.find('.width.inch input')[0] ];
	}
	Row.prototype.appendTo = function(sel) {
		this.template.appendTo(sel);
	}
	Row.prototype.remove = function(evt) {
		this.template.remove();
		var index = rows.indexOf(this);
		if (index >= 0) {
			rows.splice(index, 1);
		}
		recalc();
		if (evt) {
			evt.preventDefault();
			return false;
		}
	}
	Row.prototype.dimensions = function() {
		return {
			length: float(this.length[0].value) + float(this.length[1].value) / 12,
			width: float(this.width[0].value) + float(this.width[1].value) / 12
			};
	}
	Row.prototype.area = function() {
		var d = this.dimensions();
		return d.length * d.width;
	}
	Row.add = function(evt) {
		var newRow = new Row(rowsIncrement++);
		rows.push(newRow);
		newRow.appendTo('#area-form table:eq(0)');
		if (evt) {
			evt.preventDefault();
			return false;
		}
	}

	form.on('submit', function(e){ recalc(); e.preventDefault(); return false; });
	form.find('table .add').click(Row.add).end();
	// live() is deprecated
	$(document).on('keyup', '#area-form input', function(e) {
		recalc();
	});

	Row.add();
	Row.add();
	Row.add();

	form.show();
*/
function make_knob(el, src, mult) {
	var startPos = null, parent = el;

	if (!mult) { mult = 1; }

	//TODO: replace with custom markup, append to parent
	el = d3.select(el);

	el.on('mousedown.knob', function(evt) {
		evt.preventDefault();
		startPos = { x: evt.clientX, y: evt.clientY, value: (src && src.value) ? src.value : 0 };
	});

	el.on('mousemove.knob', function(evt) {
		// must be active
		if (lastValue === null) { return; }
		var diff  = evt.clientX - lastMouse.x,
			diffy = evt.clientY - lastMouse.y;
		if (Math.abs(diff) < Math.diff(diffy) {
			diff = diffy;
		}

		var newval = (diff * mult) + startPos.value;

		//TODO: check if above/below min/max, set bar position

		if (newval === src.value) { return; }

		el.trigger('knobupdate', src.value);
	});

	el.on('mouseup.knob', function(evt) {
		evt.preventDefault();
		startPos = null;
	});
}

})();