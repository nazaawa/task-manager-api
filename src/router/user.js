const express = require("express");
const router = express.Router();
const User = require("../model/users");
const auth = require("../middleware/auth")

const { sendWelcomeEmail,sendByeEmail } = require("../emails/account");
const multer = require("multer")
router.post("/users", async (req, res) => {
  const users = User(req.body);
  try {
    await users
      .save();
    sendWelcomeEmail(users.email, users.name);
    const token = await users.generateAuthToken();

    res.status(201).send({ users, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
},);

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
});

const upload = multer({
  fileSize: 100000,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("please upload a valid file extension"))
    };
    cb(undefined, true)
  }
})
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {

  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
})

router.delete("users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send()
  }

})

router.get("/users/:id/avatar", async (req, res) => {

  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    console.log(e)
    res.status(404).send()
  }

})
router.post('/users/login', async (req, res) => {

  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    user.save();
    res.send({ user, token })
  } catch (error) {
    res.status(404).send({ error })
  }
})
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()

  } catch (e) {

  }
})

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send()
  }
})

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password", "age"];
  const isAllowed = updates.every((map) => allowedUpdate.includes(map));

  if (!isAllowed) {
    return res.status(400).send({ error: "invalid update" });
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);

  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = req.user;
    await req.user.remove(),
      sendByeEmail(user.email, user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
