import {useEffect, useState} from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'


export default function PokeCard(props){
    const {selectedPokemon} = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) {return false}
        if (['versions', 'other'].includes(val)) {return false}
        return true 
    })

    useEffect(() => {
        // if loading, exit logic

        if(loading || !localStorage) {return}

        //check if the selected pokemon info is available in the cash
        //1. Define the cache
         let cache = {}

         if (localStorage.getItem('pokedex')){
            cache = JSON.parse(localStorage.getItem('pokedex'))
         }

         if (selectedPokemon in cache){
             setData(cache[selectedPokemon])
             return 
         }
         
         //fetch the selected pokemon from the API

         async function fetchPokemonData(){
            setLoading(true)
            try{
              const baseUrl = 'https://pokeapi.co/api/v2/'
              const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
              const finalUrl = baseUrl + suffix
              const res = await fetch(finalUrl)
              const pokemonData = await res.json()
              setData(pokemonData)


              cache[selectedPokemon] = pokemonData
              localStorage.setItem('pokedex',JSON.stringify(cache))   
            }
            catch (err){
                console.log(err.message)
            } finally {
                setLoading(false)
            }
         }

         fetchPokemonData()


        //2. Check if the selected pokemon is in the cache
        //3 Otherwise fetch the selected pokemon from the API
        //4 If we fetch from the API make sure to save the info in the cache for next time

    }, [selectedPokemon])

    if (loading || !data){
        return (
            <div>
                <h4>Loading ....</h4>
            </div>
        )
    }


    return (
        <div className='poke-card'>
            <Modal handleCloseModal={() => { }}>
                <div>
                    <h6>Name</h6>
                    <h2></h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>sadasdsadsad</p>
                </div>
            </Modal>
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className='type-container'>
                {types.map((typeObj, typeIndex) =>{
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                } )}
            </div>

            <img src={'./pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={'${name}-large-img'} />

            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>

            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat} = statObj
                    return (
                        <div key={statIndex} className='stat-item'> 
                        <p>{stat?.name.replaceAll('-', ' ')}</p>
                        <h4>{base_stat}</h4>
                        </div>
                )
                })}
            </div>

            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move' key={moveIndex} onClick={() => {}}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>

        </div>
    )
}