
import Footer from "../../components/Footer"
import CheckoutBody from "./CheckoutBody"
import Navbar from "../../components/navbar"

function Checkout() {
    return (
        <main>
            <header>
                <Navbar></Navbar>
            </header>
            <div>
                <CheckoutBody></CheckoutBody>
            </div>
            <footer>
                <Footer></Footer>
            </footer>
        </main>
    )
}

export default Checkout