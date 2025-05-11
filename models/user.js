const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    // passportがusernameとpasswordを作ってくれる
    email: {
        type: String,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingPasswordError: 'パスワードが入力されていません',
        AttemptTooSoonError: 'アカウントは現在ロックされています。後で再試行してください',
        TooManyAttemptsError: '失敗したログイン試行が多すぎてアカウントがロックされました',
        NoSaltValueStoredError: '認証不可能です',
        IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています',
        IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています',
        MissingUsernameError: 'ユーザー名が入力されていません',
        UserExistsError: '指定されたユーザー名のユーザーはすでに登録されています'
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User