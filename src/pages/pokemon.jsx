/*
  Structures used to track name and tags are maps resembling an address book
  with two keys. The first key is the first letter. Its value is another map:
    Key is the whole search word.
    Value is an array of student data (name or tag could be used twice).

  nameMap, tagMap structure:
  i: {
       ingaberg: [studentData...]
       iban: [studentData...]
     }
*/

import React from 'react';
import Search from '../components/search';
import { cloneDeep } from 'lodash';
import { addToMap, search } from '../lib/searchMap';
import PokemonList from '../components/pokemonList';

let nameMap = {};
let tagMap = {};
let pokemonData = [];
let pokemonList = [];

export default class PokemonPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemon: [],
      isLoading: true,
      name: '',
      tag: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.addTag = this.addTag.bind(this);
  }

  componentDidMount() {
    fetch('https://pokeapi.co/api/v2/pokemon')
      .then(response => response.json())
      .then(data => {
        pokemonList = data.results;
        pokemonList.forEach(async pokemon => {
          pokemonData = await fetch(pokemon.url)
        })
        this.buildNameMap();
        this.setState({
          pokemon: cloneDeep(pokemonData),
          isLoading: false
        });
      });
  }

  buildNameMap() {
    pokemonData.forEach(pokemon => {
      const name = pokemon.name.toLowerCase();
      addToMap(nameMap, name, pokemon);
    });
  }

  handleChange(event) {
    const key = event.target.name;
    const value = event.target.value;

    console.log('handleChange');
    console.log('key', key);
    console.log('value', value);

    let nameSet;
    if (key === 'name' && value === '') {
      nameSet = new Set(pokemonData);
    } else if (key === 'name') {
      nameSet = search(nameMap, value);
    } else if (this.state.name) {
      nameSet = search(nameMap, this.state.name);
    }

    let tagSet;
    if (key === 'tag' && value === '') {
      tagSet = new Set(pokemonData);
    } else if (key === 'tag') {
      tagSet = search(tagMap, value);
    } else if (this.state.tag) {
      tagSet = search(tagMap, this.state.tag)
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
      this.setState({ pokemon: cloneDeep(Array.from(pokemon)) })
    } else {
      this.setState({ pokemon: cloneDeep(pokemonData) });
    }

    this.setState({ [key]: value });
  }

  addTag(tag, pokemonId) {
    const pokemon = pokemonData.find(pokemon => pokemon.id === pokemonId);

    addToMap(tagMap, tag.toLowerCase(), pokemon);

    if (!pokemon.tags) {
      pokemon.tags = [tag];
    } else {
      pokemon.tags.push(tag);
    }

    const newPokemonData = this.state.pokemon.map(s => {
      if (s.id === pokemonId) {
        let newPokemon = cloneDeep(pokemon);
        return newPokemon;
      }
      return s;
    });
    this.setState({ pokemon: newPokemonData });
  }

  render() {
    return (
      this.state.isLoading
      ? <div>Loading pokemon Page</div>
      : <div className="container">
          <div className="pokemon-list scroll-hide">
            <Search handleChange={this.handleChange}
              value={this.state.name} type="name"/>
            <Search handleChange={this.handleChange}
              value={this.state.tag} type="tag" />
            <PokemonList pokemon={this.state.pokemon}
              addTag={this.addTag}/>
          </div>
        </div>
    );
  }
}
