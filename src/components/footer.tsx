import './css/footer.css'

function footer() {
  return (
    <footer className="site-footer" id="contact">
     <h2 className="footer-title">Gabriel Luigi Gutierrez</h2>
     <p className="footer-copy">&copy; {new Date().getFullYear()} Gabriel. All rights reserved.</p>
    </footer>
  )
}

export default footer


