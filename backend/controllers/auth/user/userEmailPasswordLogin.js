import User from "../../../models/User/User.js";


export const signUp = async (req, res) => {
    let signUpError = false;
    let error = "";
    const {
      username,
      email,
      password,
    } = req.body;
  
    const newExpert = new User({
      username,
      email,
    });
  
    const registeredExpert = await User.register( newExpert, password).catch(
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
          res.status(200).json({
            success: true,
            message: "successSignUp",
          });
        }
      });
    } else {
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
  }