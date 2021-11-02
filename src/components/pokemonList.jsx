import React from 'react';
import Profile from './profile';

export default function PokemonList(props) {
  const pokemonList = props.pokemon.map(pokemon =>
    <li key={pokemon.id} className="border-bottom-gray">
      <Profile pokemon={pokemon} addTag={props.addTag} />
    </li>
  );

  return (<ul>{ pokemonList }</ul>);
}
