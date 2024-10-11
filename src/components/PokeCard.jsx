import {useEffect, useState} from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import {TypeCard} from './TypeCard'

export default function PokeCard(props){
    const {selectedPokemon} = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const {name, height, abilities, types, moves, sprites} = data || {}

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
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className='type-container'>
                {types.map((type, typeIndex) =>{
                    return (
                        <TypeCard key={typeIndex} type={type} />
                    )
                } )}
            </div>

        </div>
    )
}