export default class RegisterComponent {
  constructor(targetEl) {
    document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
    this.eventsHookUp();
    this.isPageValid = {};
  }

  signInTemplate() {
    return `<section  class="content login-main">
          <section class="login-section login-section-item1">
              <section class="heading margin-top-25px">Signup</section>
              <section class="bold margin-top-25px">We do not share your personal details with anyone.</section>
          </section>
          <section class="login-section login-section-item2">
              <form>
                      <label class="form-label bold hidden" for="firstName">First Name</label>
                      <input class="form-input" type="text" name="firstName" id="firstName" placeholder="First Name" required>
                      <label class="form-label hidden errorMsg" for="firstName-validation">Please provide First Name.</label>
                      <label class="form-label bold hidden" for="lastName">Last Name</label>
                      <input class="form-input" type="text" name="lastName" id="lastName" placeholder="Last Name" required>
                      <label class="form-label hidden errorMsg" for="lastName-validation">Please provide Last Name.</label>
                  <label class="form-label bold hidden" for="email">Email</label>
                  <input class="form-input" type="email" name ="email" id="email" placeholder="Email" required>
                  <label class="form-label hidden errorMsg" for="email-validation">Please provide valid Email.</label>
                  <label class="form-label bold hidden" for="password">Password</label>
                  <input class="form-input" type="password" name="password" id="password" placeholder="Password" required>
                  <label class="form-label hidden errorMsg" for="password-validation">Password is not strong enough.</label>
                  <label class="form-label bold hidden" for="confirmPassword">Password</label>
                  <input class="form-input" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required>
                  <label class="form-label hidden errorMsg" for="confirmPassword-validation">Provided password and confirm password do not match.</label>
                  <button id="login" class="button">Login</button></div>
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
