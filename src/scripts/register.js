export default class RegisterComponent {
    constructor(targetEl) {
      document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
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
                      <label class="form-label bold hidden" for="lastName">Last Name</label>
                      <input class="form-input" type="text" name="lastName" id="lastName" placeholder="Last Name" required>
                  <label class="form-label bold hidden" for="Email">Email</label>
                  <input class="form-input" type="email" name ="email" id="email" placeholder="Email" required>
                  <label class="form-label bold hidden" for="password">Password</label>
                  <input class="form-input" type="password" name="password" id="password" placeholder="Password" required>
                  <label class="form-label bold hidden" for="confirmPassword">Password</label>
                  <input class="form-input" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required>
                  <button class="button">Login</button></div>
              </form>
              </section>
      </section>`;
    }
  }