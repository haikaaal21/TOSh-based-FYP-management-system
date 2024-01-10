import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";

const LoginPage = () => {
    return (
        <>
            <div>
                <SparesLogoFull />
            </div>
            <h1>Get started</h1>
            <p>Already have an account? <u><b><a href="">Sign in here</a></b></u></p>
            <section className="bar-section">
                <div id="bar-1"></div>
                <div id="bar-2"></div>
                <div id="bar-3"></div>
            </section>
            <form>
                <section id="section-1">
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" placeholder="John" />
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Doe" />
                    </div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="johndoe@gmail.com" />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="********" />
                    <label htmlFor="confirmPassword">Re-enter Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="********" />
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" />
                </section>
                <section id="section-2">
                    <label htmlFor="institution">Institution</label>
                    {/* Search dropdown */}
                    <label htmlFor="matricNum">Matric Number</label>
                    <input type="number" id="matricNum" name="matricNum" placeholder="123456" />
                    <label htmlFor="typeOfAccount">Type of account</label>
                    <div>
                        <input type="radio" id="student" name="typeOfAccount" value="student" />
                        <label htmlFor="student">Student</label>
                        <input type="radio" id="staff" name="typeOfAccount" value="staff" />
                        <label htmlFor="staff">staff</label>
                    </div>
                    {/* If staff */}
                    <div>
                        {/* Back Button */}
                        {/* Create account Button */}
                    </div>
                </section>
                <section id="section-3">
 
                </section>
            </form>

        </>
    )
}

export default LoginPage;