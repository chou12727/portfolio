require('dotenv').config();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const Grocery = require('./models/grocery');
const User = require('./models/user');
const methodOverride = require('method-override');
const AppError = require('./AppError');
const { grocerySchema } = require('./JoiSchema');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongodb接続OK')
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }
}));

app.use(passport.initialize());
// app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
});
app.use(cors({
  origin: 'https://portfolio-client-bi16.onrender.com',
  credentials: true
}));

app.get('/home', (req, res) => {
    res.send('home')
})

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
};

function groceryValidate(req, res, next) {
    const { error } = grocerySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',')
        throw new AppError(401, msg)
    } else {
        next()
    }
};

function apiIsLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return next(new AppError(401, 'ログインが必要です'));
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError(401, '無効なトークンです'));
        }
        req.user = decoded;
        next();
    });
};


app.get('/api/check-auth', apiIsLoggedIn, (req, res) => {
  res.status(200).json({ user: { _id: req.user._id, username: req.user.username } });
});

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.wantUrl = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next()
};
async function verifyGroceryOwner(req, res, next) {
    try {
        const { id } = req.params;
        const grocery = await Grocery.findById(id);
        if (!grocery || !grocery.userId.equals(req.user._id)) {
            return res.status(404).json({ error: 'Not found' });
        };
        next();
    } catch (e) {
        next(e)
    }
};

app.get('/api/groceries', apiIsLoggedIn, wrapAsync(async (req, res) => {
    const groceries = await Grocery.find({ userId: req.user._id });
    res.status(200).json(groceries)
}));



// app.get('/register', (req, res) => {
//     res.render('users/register')
// });


app.post('/api/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        const token = jwt.sign(
            { _id: registeredUser._id, username: registeredUser.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60
        });
        res.status(201).json({
            message: 'ユーザー登録が完了しました',
            user: { username: registeredUser.username }
        });

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/api/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'ユーザーが見つかりません' });
        }

        const isValid = await user.authenticate(password);
        if (!isValid.user) {
            return res.status(400).json({ error: 'パスワードが間違っています' });
        }

        const token = jwt.sign(
            { _id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60
        });

        res.status(200).json({ message: 'ログイン成功', user: { username: user.username } });
    } catch (e) {
        next(e);
    }
});
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'ログアウトしました' });
});

// app.post('/register', async (req, res, next) => {
//     try {
//         const { username, password } = req.body;
//         const user = new User({ username, email });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) { return next(err); }
//             req.flash('success', `${registeredUser.username}さん、ようこそ`);
//             res.redirect('/groceries')
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('/register')
//     }
// });

// app.get('/login', (req, res) => {
//     res.render('users/login');
// });


// app.post('/login', (req, res, next) => { if (req.session.wantUrl) res.locals.wantUrl = req.session.wantUrl; next(); },
//     passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//         const redirectUrl = res.locals.wantUrl || '/groceries';
//         req.flash('success', `${req.user.username}さん、おかえり`);
//         res.redirect(redirectUrl)
//     });

// app.get('/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) { return next(err) }
//         req.flash('success', 'ログアウトしました');
//         res.redirect('/login')
//     });
// })

// app.get('/groceries', isLoggedIn, wrapAsync(async (req, res) => {
//     const groceries = await Grocery.find({ userId: req.user._id });
//     res.render('groceries/index', { groceries })
// }));

// app.get('/groceries/new', isLoggedIn, (req, res) => {
//     res.render('groceries/new')
// });

// app.post('/groceries', isLoggedIn, groceryValidate, wrapAsync(async (req, res) => {
//     const grocery = new Grocery(req.body);
//     grocery.userId = req.user._id;
//     await grocery.save();
//     req.flash('success', '新しい商品を追加しました');
//     res.redirect('/groceries')
// }));

app.post('/api/groceries', apiIsLoggedIn, groceryValidate, wrapAsync(async (req, res) => {
    const grocery = new Grocery(req.body);
    console.log(req.body);
    grocery.userId = req.user._id;
    await grocery.save();
    res.status(201).json({ message: '商品を追加しました', grocery });
}));

// app.get('/groceries/:id/edit', isLoggedIn, verifyGroceryOwner, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const grocery = await Grocery.findById(id);
//     // if (!grocery) { throw new AppError(404, '商品が見つかりません') };
//     res.render('groceries/edit', { grocery });
// }));

// app.put('/groceries/:id', isLoggedIn, verifyGroceryOwner, groceryValidate, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Grocery.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
//     res.redirect(`/groceries/${id}`)
// }));

app.put('/api/groceries/:id', apiIsLoggedIn, verifyGroceryOwner, groceryValidate, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await Grocery.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ grocery: updated });
}));

app.get('/groceries/:id', isLoggedIn, verifyGroceryOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const grocery = await Grocery.findById(id);
    // if (!grocery) {
    //     // throw new AppError(404, '商品が見つかりません') 
    //     req.flash('error', '商品が見つかりません。');
    //     return res.redirect('/groceries');
    // };
    res.render('groceries/show', { grocery });
}));

// app.delete('/groceries/:id', isLoggedIn, verifyGroceryOwner, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Grocery.findByIdAndDelete(id);
//     req.flash('success', '商品を削除しました');
//     res.redirect('/groceries')
// }));


app.delete('/api/groceries/:id', apiIsLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const grocery = await Grocery.findById(id);
    if (!grocery || !grocery.userId.equals(req.user._id)) {
        return res.status(404).json({ error: '商品が見つかりません' });
    }
    await Grocery.findByIdAndDelete(id);
    res.status(200).json({ message: '削除しました' });
}));


app.all('*', (req, res, next) => {
    next(new AppError(404, 'ページが見つかりませんでした'))
});

app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        req.flash('error', '無効なid');
        return res.redirect('/groceries');
    }
    next(err)
});

// app.use((err, req, res, next) => {
//     const { status = 401, message = 'エラーが発生しました' } = err;
//     res.status(status).send(message);
// })
app.use((err, req, res, next) => {
    const { status = 500, message = 'エラーが発生しました' } = err;
    res.status(status).json({ error: message });
});


app.listen(PORT, () => {
    console.log(`ポート${PORT}でリクエスト待受中...`)
});
