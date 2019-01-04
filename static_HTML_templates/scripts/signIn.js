class SignInComponent{
    constructor(targetEl) {
        document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
    }

    signInTemplate() {
        return `<section  class="content login-main">
        <section class="login-section login-section-item1">
            <section class="heading margin-top-25px">Login</section>
            <section class="bold margin-top-25px">Get access to your Orders, Wishlist and Recommendations</section>
        </section>
        <section class="login-section login-section-item2">
            <form>
                <label class="form-label bold hidden" for="email">Email</label>
                <input class="form-input" type="email" id="email" placeholder="Email" required>
                <label class="form-label bold hidden" for="password">Password</label>
                <input class="form-input" type="password" id="password" placeholder="Password" required>
                <button class="button">Login</button></div>
            </form>
            </section>
    </section>`;
    }
}