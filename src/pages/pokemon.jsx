/*
  Structures used to track name and tags are maps resembling an address book
  with two keys. The first key is the first letter. Its value is another map:
    Key is the whole search word.
    Value is an array of student data (name or tag could be used twice).

  nameMap, tagMap structure:
  p: {
       poliwag: [pokemonData...]
     }
*/

import React, { useEffect, useState } from 'react';
import Search from '../components/search';
import { cloneDeep } from 'lodash';
import { addToMap, search } from '../lib/searchMap';
import PokemonList from '../components/pokemonList';

let nameMap = {};
let tagMap = {};
let pokemonData = [];

export default function PokemonPage (props) {
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetchPokemonList()
    .then(data => {
      data.forEach(pokemon => {
        console.log(pokemon);
        const { id, name, stats, types } = pokemon;
        pokemonData.push({ id, name, stats, types,
          url: pokemon.sprites.other['official-artwork'].front_default
        });
      });

      buildNameMap();
      setPokemon(pokemonData);
      setLoading(false);
    })
    .catch((e) => {
      console.error(e);
    });
  // eslint-disable-next-line
  }, []);

  const fetchPokemonList = async () => {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();

    let pokemonFetches = [];
    data.results.forEach(pokemon => {
      pokemonFetches.push(fetchPokemon(pokemon.url));
    });

    let values = await Promise.all(pokemonFetches);
    return values;
  }

  const fetchPokemon = async (url) => {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  }

  const buildNameMap = () => {
    pokemonData.forEach(pokemon => {
      const name = pokemon.name.toLowerCase();
      addToMap(nameMap, name, pokemon);
    });
  }

  const handleChange = (event) =>  {
    const key = event.target.name;
    const value = event.target.value;

    let nameSet;
    if (key === 'name' && value === '') {
      nameSet = new Set(pokemonData);
    } else if (key === 'name') {
      nameSet = search(nameMap, value);
    } else if (name) {
      nameSet = search(nameMap, name);
    }

    let tagSet;
    if (key === 'tag' && value === '') {
      tagSet = new Set(pokemonData);
    } else if (key === 'tag') {
      tagSet = search(tagMap, value);
    } else if (tag) {
      tagSet = search(tagMap,tag)
    }

    let pokemon;
    if (nameSet && tagSet) {
      pokemon = new Set([...nameSet].filter(x => tagSet.has(x)));
    } else if (nameSet) {
      pokemon = nameSet;
    } else if (tagSet) {
      pokemon = tagSet;
    }

    if (pokemon) {
      setPokemon(cloneDeep(Array.from(pokemon)));
    } else {
      setPokemon(cloneDeep(pokemonData));
    }

    if (key === 'name') {
      setName(value);
    } else if (key === 'tag') {
      setTag(value);
    }
  }

  const addTag = (tag, pokemonId) => {
    const pokemon = pokemonData.find(pokemon => pokemon.id === pokemonId);

    addToMap(tagMap, tag.toLowerCase(), pokemon);

    if (!pokemon.tags) {
      pokemon.tags = [tag];
    } else {
      pokemon.tags.push(tag);
    }

    const newPokemonData = pokemon.map(s => {
      if (s.id === pokemonId) {
        let newPokemon = cloneDeep(pokemon);
        return newPokemon;
      }
      return s;
    });
    setPokemon(newPokemonData);
  }

  return (
    isLoading
    ? <div>Loading pokemon Page</div>
    : <div className="container">
        <div className="pokemon-list scroll-hide">
          <Search handleChange={handleChange}
            value={name} type="name"/>
          <Search handleChange={handleChange}
            value={tag} type="tag" />
          <PokemonList pokemon={pokemon}
            addTag={addTag}/>
        </div>
      </div>
  );
}
