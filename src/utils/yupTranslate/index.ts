/*eslint-disable no-template-curly-in-string*/

import { LocaleObject, printValue } from 'yup';

// Basé sur https://github.com/jquense/yup/blob/2973d0a/src/locale.js
export const mixed: LocaleObject['mixed'] = {
  default: '${path} est invalide.',
  required: '${path} est un champ obligatoire.',
  oneOf: "${path} doit être l'une des valeurs suivantes : ${values}.",
  notOneOf: "${path} ne doit pas être l'une des valeurs suivantes : ${values}.",
  notType: ({ path, type, value, originalValue }) => {
    const isCast = originalValue != null && originalValue !== value;
    let msg =
      `${path} doit être de type \`${type}\`, ` +
      `mais la valeur fournie était : \`${printValue(value, true)}\`` +
      (isCast
        ? ` (convertie depuis la valeur \`${printValue(originalValue, true)}\`).`
        : '.');

    if (value === null) {
      msg +=
        `\n Si « null » est censé représenter une valeur vide, assurez-vous de marquer le schéma comme` +
        ' `.nullable()`';
    }

    return msg;
  },
};

export const string: LocaleObject['string'] = {
  length: '${path} doit contenir exactement ${length} caractères.',
  min: '${path} doit contenir au moins ${min} caractères.',
  max: '${path} doit contenir au plus ${max} caractères.',
  matches: '${path} doit correspondre au motif suivant : "${regex}".',
  email: '${path} doit être une adresse email valide.',
  url: '${path} doit être une URL valide.',
  trim: '${path} ne doit pas contenir d\'espaces au début ou à la fin.',
  lowercase: '${path} ne doit contenir que des lettres minuscules.',
  uppercase: '${path} ne doit contenir que des lettres majuscules.',
};

export const number: LocaleObject['number'] = {
  min: '${path} doit être supérieur ou égal à ${min}.',
  max: '${path} doit être inférieur ou égal à ${max}.',
  lessThan: '${path} doit être inférieur à ${less}.',
  moreThan: '${path} doit être supérieur à ${more}.',
  positive: '${path} doit être un nombre positif.',
  negative: '${path} doit être un nombre négatif.',
  integer: '${path} doit être un nombre entier.',
};

export const date: LocaleObject['date'] = {
  min: 'Le champ ${path} doit être postérieur ou égal à ${min}.',
  max: 'Le champ ${path} doit être antérieur ou égal à ${max}.',
};

export const boolean: LocaleObject['boolean'] = {};

export const object: LocaleObject['object'] = {
  noUnknown: "Le champ ${path} ne peut pas contenir de clés non spécifiées dans la structure de l'objet.",
};

export const array: LocaleObject['array'] = {
  min: 'Le champ ${path} doit contenir au moins ${min} éléments.',
  max: 'Le champ ${path} doit contenir moins ou exactement ${max} éléments.',
};
