import ValidationService from '../services/validationService';
export default class SignInComponent{
    constructor(targetEl, valService = new ValidationService()) {
        this.valService = valService;
        document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
        this.eventsHookUp();
        this.isPageValid = {};
    }

    signInTemplate() {
        return `<section  class="content login-main">
        <section class="login-section login-section-item1">
            <section class="heading margin-top-25px">Login</section>
            <section class="bold margin-top-25px">Get access to your Orders, Wishlist and Recommendations</section>
        </section>
        <section class="login-section login-section-item2">
            <form id="login-form" noValidate>
                <label class="form-label bold hidden" for="email">Email</label>
                <input class="form-input" type="email" name="email" id="email" placeholder="Email" required>
                <label class="form-label hidden errorMsg" for="email-validation">Please provide valid Email.</label>

                <label class="form-label bold hidden" for="password">Password</label>
                <input class="form-input" type="password" name="password" id="password" placeholder="Password" required>
                <button id="submit" class="button disabled">Login</button></div>
            </form>
            </section>
    </section>`;
    }
    blurHandler(e) {
        const type = event.target.attributes['name'].value;
        let errorMessage = document.querySelector(`[for="${type}-validation"]`);
        if(errorMessage) {
            if(!this.valService.validationMapper(type, e.target.value)) {
                errorMessage.classList.remove('hidden');
                this.isPageValid[type] = false;
            } else {
                errorMessage.classList.add('hidden');
                this.isPageValid[type] = true;
            }
        }
    }

    checkPageValidation() {
        let valid = true;
        for (const key in this.isPageValid) {
            if (this.isPageValid.hasOwnProperty(key)) {
                if(valid) {
                    valid = this.isPageValid[key];
                }
            }
        }
        return key;
    }

    eventsHookUp() {
        document.querySelectorAll('[class="form-input"]').forEach((item) => {
            item.addEventListener('focus',(event) => {
                const type = event.target.attributes['name'].value;
                document.querySelector(`[for="${type}"]`).classList.remove('hidden');
            })

            item.addEventListener('blur', this.blurHandler.bind(this))
        })
        document.querySelector('#submit').addEventListener('click', (e)=> {
            e.preventDefault();
            document.querySelectorAll('[class="form-input"]').forEach((item) => {
                var event = new Event('blur', {
                    'bubbles': true,
                    'cancelable': true
                });
                
                item.dispatchEvent(event);
           })
           if(this.checkPageValidation()) {
               window.location.hash = '#home';
           }
        })
    }
}