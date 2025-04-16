import Expert from "../../../models/Expert/Expert.js";

export const signUp = async (req, res) => {
  let signUpError = false;
  let error = "";
  const { username, email, password } = req.body;

  console.log("Body : ",req.body);

  const newExpert = new Expert({
    username,
    email,
    profile: {
      fullname: req.body.profile.fullname,
      experience: Number(req.body.profile.experience),
      qualification: req.body.profile.qualification,
      expertType: req.body.profile.expertType,
      contact: req.body.profile.contact,
    },
  });

  const registeredExpert = await Expert.register(newExpert, password).catch(
    (err) => {
      console.log("signUpError");
      console.log(err);
      signUpError = true;
      error = err.message;
    }
  );

  if (!signUpError && registeredExpert) {
    req.login(registeredExpert, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: err.message,
          success: false,
        });
      } else {
        console.log("Sign Up success : ");
        res.status(200).json({
          success: true,
          message: "successSignUp",
        });
      }
    });
  } else {
    console.log("Sign Up error : ");
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "successLogin",
  });
};

export const failureLogin = async (req, res) => {
  console.log("failure");
  res.status(401).json({
    success: false,
    message: "failureLogin",
  });
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successLogOut",
      });
    }
  });
};

export default {
  signUp,
  login,
  failureLogin,
  logout,
};
