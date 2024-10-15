export default function Header(props){
    const {handleToggle} = props
    return (
        <header>
            <button onClick={handleToggle} className="open-nav-button">
                <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-gradient">Pokedex</h1>
        </header>
)
}