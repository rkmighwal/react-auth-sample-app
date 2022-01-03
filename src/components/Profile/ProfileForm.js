import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const FIREBASE_API_KEY = "AIzaSyBZDsG1SUVzn6nH-srULAxESyJ2u7pyRu8";

const ProfileForm = () => {
  const passwordInputRef = useRef();
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();

    const password = passwordInputRef.current.value;

    // add validation
    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authContext.token,
          password,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          history.replace("/");
        } else {
          return response.json().then((data) => {
            const errorMessage = data?.error?.message || "Request failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          ref={passwordInputRef}
          minLength="7"
          id="new-password"
        />
      </div>
      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <p>Sending request...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
