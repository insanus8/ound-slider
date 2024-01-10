class RoundSlider {
	#range
	#arg = 0

	pArg = 0
	pValue = 0

	constructor(option) {
		this.startShift = option.startShift ?? 0
		this.endShift = option.endShift ?? 0
		this.angle = 360 - this.startShift - this.endShift
		this.template = option.template ?? ((v) => `${v}deg`)
		this.range = option.range
	}

	get range() {
		return this.#range
	}

	set range(range) {
		this.#range = range

		this.wrapp = document.createElement('div')
		this.meaning = document.createElement('div')
		this.dot = document.createElement('div')
		
		this.wrapp.classList.add('round-slider__circle')
		this.meaning.classList.add('round-slider__value')
		this.dot.classList.add('round-slider__dot')
		this.range.classList.add('round-slider__range')

		this.range.parentNode.replaceChild(this.wrapp, this.#range)
		this.wrapp.append(this.meaning)
		this.wrapp.append(this.#range)
		this.wrapp.append(this.dot)
		this.wrapp.addEventListener("dblclick", (event) => {
			this.dot.classList.add('transition')
			this.tuneRoundSlider(event)
		})
		this.dot.addEventListener('transitionend', () => this.dot.classList.remove('trans'))
		this.wrapp.addEventListener("mousedown", (event) => {
			this.dot.classList.remove('transition')
			this.isMouseDown = true
		});

		this.wrapp.addEventListener('mousemove', (event) => {
			if (this.isMouseDown && (event.buttons == 1 || event.buttons == 3)) {
				this.tuneRoundSlider(event)
			}
		})

		this.wrapp.addEventListener('mouseup', () => {
			this.isMouseDown = false
		})

		this.step = +this.range.step ?? 10
		this.min = +this.range.min ?? 0
		this.max = +this.range.max ?? 360
		this.value = +this.range.value ?? 0
		this.arg = Math.round((this.range.value - this.min) / (this.max - this.min) * this.angle) + this.startShift
	}

	get arg() {
		return this.#arg
	}

	set arg(arg) {
		if (arg < this.startShift || arg > (360 - this.endShift)) return
		
		const pros = ((arg - this.startShift) / this.angle).toFixed(2)
		const value = Math.round( (pros * (this.max - this.min)) + this.min)
		const remainder = value % this.step

		this.pValue = this.value
		this.pArg = this.arg
		this.value = value - remainder
		this.#arg = arg

		this.range.setAttribute('value', this.value)
		this.dot.style.transform = `rotate(${arg}deg)`
		this.meaning.textContent = `${this.template(this.value)}`
	}

	tuneRoundSlider(event) {
		const cor = this.wrapp.getBoundingClientRect()
		const R = cor.width / 2
		const x = event.clientX - cor.x - R
		const y = (event.clientY - cor.y - R) * -1
	
		
		const vX = x - 0
		const vY = y - 0
		const magV = Math.sqrt(vX * vX + vY * vY)
	
		// кординаты ближайшей точки на окружности
		const aX = 0 + ((vX / magV) * R)
		const aY = 0 + ((vY / magV) * R)
		
		let newArg = Math.round((Math.atan2(aY, aX) * (180 / Math.PI) * -1)) + 90
		if (newArg < 0) newArg += 360
	
		this.arg = newArg 
	}
}

const roundSlider = new RoundSlider({
	range: document.querySelector('.range'),
	startShift: 10,
	endShift: 10,
})