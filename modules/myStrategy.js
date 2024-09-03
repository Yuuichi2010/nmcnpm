const passport = require('passport');
const { Strategy } = require('passport-strategy');

module.exports = class MyStrategy extends Strategy{
    constructor(verify, options){
        super();
        this.name = 'myStrategy';
        this.verify = verify;
        this.UserName = (options && options.UserName) ? options.UserName : 'UserName';
        this.Pass = (options && options.Pass) ? options.Pass:'Pass';
        passport.strategies[this.name] = this;
    }
    
    authenticate(req, options) {
        const un = req.body.inputUserName;
        const pw = req.body.inputPassword;
        this.verify(un, pw, (err, user) => {
            if (err){
                return this.fail(err);
            }
            if (user){ 
                return this.success(user, null);
            }
            this.fail('invalid auth');
        });
    }
}
