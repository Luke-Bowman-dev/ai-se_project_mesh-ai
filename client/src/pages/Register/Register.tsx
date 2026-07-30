import logo from "../../assets/logo.png";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../utils/api";


export default function RegisterPage() {
    const { values, errors, isValid, handleChange } = useFormWithValidation({
        name: "",
        email: "",
        password: ""
    });
    const [submitError, setSubmitError] = useState('');

    const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
          event.preventDefault();
          if (!isValid) return;
          try {
           await registerUser(values.name, values.email, values.password);
           navigate('/login');
          } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
          }
          }

      function getNavLinkClass({ isActive }: { isActive: boolean }) { 
    return isActive ? "form__nav-link form__nav-link_active" : "form__nav-link"; 
  } 
  

    return (
        <>
        <header className="header">
            <img className="header__logo" alt="MeshAI logo" src={logo}/>
        </header>
        <form className="form" onSubmit={handleSubmit} noValidate>
            <h1 className="form__title">Create account</h1>
            <p className="form__description">Access your organisation’s secure workspace</p>
            <nav className="form__nav">
                <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
                <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
            </nav>
            <div className="form__input-container">
                <div className="form__field-group">
                    <label className="form__label"> Name
                    <input className="form__input" name="name" type="text" minLength={2} maxLength={40} required value={values.name ?? ''} onChange={handleChange} />
                    </label>
                    {errors.name && <span className="form__error">{errors.name}</span>}
                </div>
                <div className="form__field-group">
                    <label className="form__label"> Email
                    <input className="form__input" name="email" type="email" required value={values.email ?? ''} onChange={handleChange} />
                    </label>
                    {errors.email && <span className="form__error">{errors.email}</span>}
                </div>
                <div className="form__field-group">
                    <label className="form__label"> Password
                    <input className="form__input" name="password" type="password" minLength={8} required value={values.password ?? ''} onChange={handleChange} />
                    </label>
                    {errors.password && <span className="form__error">{errors.password}</span>}
                </div>
                {submitError && <p className="form__error">{submitError}</p>}
            </div>
            <button className="form__submit-btn" type="submit" disabled={!isValid}>
                Create account
            </button>
        </form>
        </>
        ); 
}