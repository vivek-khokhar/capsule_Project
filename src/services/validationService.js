export default class ValidationService{
    validationMapper(type, value) {
        switch (type) {
            case email:
                return this.validateEmail(value);
            case password:
                return this.validateAlphaNumeric(value);
            
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateMinLength(input, value) {
        return input.length >= value;
    }

    validateMaxLength(input, value) {
        return input.length <= value;
    }

    validateAlphaNumeric(value) {
        const re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
        return re.test(value);
    }
    validateNoSpace(input) {
        const re = /^\S*$/;
        return re.test(value);
    }

    confirmPassword(val1, val2) {
        return val1 === val2;
    }

}
