import PlaceholderRenderer from '../../components/PlaceholderRenderer'

export const WORDS = [
  'aeroplane',
  'camping',
  'war',
  'thunder',
  'insurance',
  'brick',
  'cloud',
  'calendar',
  'door',
  'snake',
  'stomach',
  'apple',
  'advertisement',
  'elbow',
  'grandmother',
  'uncle',
  'spy',
  'farm',
  'spring',
  'summer',
  'autumn',
  'winter',
  'feather',
  'potato',
  'fiction',
  'snails',
  'operation',
  'milk',
  'bell',
  'hen',
  'picture',
  'crown',
  'trains',
  'value',
  'maid',
  'minister',
  'color',
  'route',
  'wren',
  'step',
  'spoon',
  'direction',
  'death',
  'carriage',
  'quarter',
  'view',
  'vest',
  'fog',
  'base',
  'pig',
  'elbow',
  'writing',
  'paper',
  'table',
  'sisters',
  'game',
  'mitten',
  'care',
  'creature',
  'regret',
  'person',
  'base',
  'lettuce',
  'advice',
  'year',
  'breakfast',
  'wrist',
  'degree',
  'vacation',
  'shame',
  'spot',
  'hot',
  'grandmother',
  'farm',
  'degree',
  'duck',
  'direction',
  'line',
  'calculator',
  'game',
  'purpose',
  'carriage',
  'size',
  'minister',
  'story',
  'disgust',
  'music',
  'desk',
  'bomb',
  'noise',
  'agreement',
  'feast',
  'brain',
  'kettle',
  'crown',
  'drum',
  'fish',
  'cub',
  'hour',
  'ladybug',
  'tongue',
  'nut',
  'sneeze',
  'rail',
  'spot',
  'support',
  'tramp',
  'recess',
  'name',
  'hate',
  'ear',
  'position',
  'worm',
  'parcel',
  'straw',
  'line',
  'story',
  'fish',
  'silk',
  'pear',
  'flower',
  'knot',
  'quartz',
  'goat',
  'brick',
  'river',
  'doll',
  'songs',
  'oatmeal',
  'plot',
  'card',
  'playground',
  'twig',
  'bed',
  'rest',
  'jelly',
  'ghost',
  'quiver',
  'heat',
  'nest',
  'jellyfish',
  'jellyfish',
  'jump',
  'bulb',
  'education',
  'tax',
  'view',
  'story',
  'need',
  'friction',
  'thunder',
  'angle',
  'earth',
  'bike',
  'peace',
  'bell',
  'jar',
  'wall',
  'caption',
  'route',
  'crush',
  'locket',
  'magic',
  'mine',
  'pies',
  'tiger',
  'cord',
  'grape',
  'songs',
  'condition',
  'salt',
  'sun',
  'effect',
  'aftermath',
  'bee',
  'earthquake',
  'teaching',
  'condition',
  'joke',
  'notebook',
  'expert',
  'desk',
  'owl',
  'legs',
  'work',
  'map',
  'rate',
  'believe',
  'acoustics',
  'bird',
  'behavior',
  'crush',
  'hope',
  'angle',
  'act',
  'building',
  'organization',
  'clam',
  'rose',
  'pest',
  'zebra',
  'snow',
  'chalk',
  'chicken',
  'earthquake',
  'relation',
  'station',
  'discussion',
  'gold',
  'island',
  'pharoah',
]

const COUNTRIES = [
  'America',
  'Austria',
  'Australia',
  'China',
  'Egypt',
  'England',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Italy',
  'Japan',
  'Russia',
  'South Africa',
  'Turkey',
]

const OCCUPATIONS = [
  'salesman',
  'doctor',
  'lawyer',
  'teacher',
  'developer',
  'artist',
  'author',
  'poet',
  'musician',
  'singer',
]

const ANIMALS = []
const PEOPLE = []
const THINGS = ['rock']
const PLACES = []

export function chooseWord(words: string[]) {
  const newWord = WORDS[Math.floor(Math.random() * WORDS.length)]
  if (words.includes(newWord)) return chooseWord(words)
  return newWord
}
