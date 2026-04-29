/**
 * International Person Name Dictionary
 *
 * Curated first names covering primary employee regions:
 *   - Danish, Polish, Malaysian, American/English, and general international.
 *
 * Two sets are exported:
 *   PERSON_NAMES     — Unambiguous first names. Flagged whenever they appear
 *                      with an initial capital letter.
 *   AMBIGUOUS_NAMES  — Names that double as common English words (e.g. "Mark",
 *                      "May"). Only flagged when adjacent to another capitalized
 *                      word (surname heuristic).
 *
 * All entries are stored in Title Case for normalized lookup.
 */

// ─── Unambiguous Person Names ───────────────────────────────────────────────

const PERSON_NAMES = new Set([

  // ── Danish ────────────────────────────────────────────────────────────────
  // Male
  "Jesper", "Lars", "Søren", "Anders", "Kasper", "Mikkel", "Rasmus", "Morten",
  "Henrik", "Jens", "Niels", "Peder", "Torben", "Bjarne", "Carsten", "Claus",
  "Erik", "Flemming", "Gert", "Henning", "Ib", "Jakob", "Jørgen", "Knud",
  "Leif", "Mogens", "Nikolaj", "Ole", "Preben", "Rune", "Steen", "Svend",
  "Troels", "Ulrik", "Viggo", "Aksel", "Asger", "Børge", "Christen",
  "Ejnar", "Finn", "Gunnar", "Holger", "Ivar", "Joakim", "Kristian",
  "Laurits", "Magnus", "Nils", "Osvald", "Palle", "Rikard", "Sigurd",
  "Thorkild", "Valdemar", "Aage", "Bent", "Ditlev", "Esben", "Frederik",
  "Gustav", "Helge", "Ingvar", "Julius", "Karsten", "Ludvig", "Mathias",
  "Nicolai", "Oluf", "Per", "Rud", "Steffen", "Tobias", "Uffe", "Villads",
  "Anker", "Bertil", "Dagfinn", "Erling", "Frode", "Gudmund", "Harald",
  "Iver", "Jeppe", "Klaus", "Lennart", "Mads", "Nørgaard", "Otto",
  "Poul", "Rolf", "Stig", "Torsten", "Vagn", "Asgerd", "Bjarke",
  "Christian", "Dennis", "Emil", "Frede", "Hjalmar", "Jannik",
  "Kennet", "Lasse", "Markus", "Nilas", "Oskar", "Patrick", "René",
  "Sebastian", "Tage", "Viktor", "Asbjørn", "Bjørn", "Dag",
  "Eigil", "Folmer", "Halfdan", "Ingar", "Janus", "Keld",
  "Lauge", "Malthe", "Normann", "Ove", "Peer", "Regner", "Simon",
  "Thor", "Ulf", "Valentin", "Arent", "Birger", "Dines",
  // Female
  "Mette", "Pernille", "Camilla", "Sofie", "Lene", "Hanne", "Inge",
  "Kirsten", "Birgit", "Dorthe", "Else", "Grethe", "Helga", "Inger",
  "Jytte", "Karen", "Lisbet", "Margit", "Nanna", "Oda", "Pia",
  "Rigmor", "Signe", "Tove", "Ulla", "Vibeke", "Agnete", "Bodil",
  "Dagny", "Edith", "Frida", "Gerda", "Hedvig", "Ida", "Johanne",
  "Katrine", "Lærke", "Maj", "Nina", "Olivia", "Petra", "Rikke",
  "Solveig", "Thyra", "Ursula", "Vita", "Astrid", "Benedicte",
  "Connie", "Dorit", "Ellen", "Freja", "Gitte", "Helle", "Irene",
  "Jette", "Karin", "Lotte", "Merete", "Nete", "Ottilie", "Puk",
  "Randi", "Stine", "Trine", "Winnie", "Annette", "Birgitte",
  "Cecilie", "Ditte", "Elisabeth", "Fie", "Gudrun", "Henriette",
  "Ilse", "Josefine", "Klara", "Lone", "Marianne", "Naja",
  "Silje", "Thea", "Agneta", "Berit", "Dorte", "Emilie",
  "Frederikke", "Greta", "Heidi", "Isa", "Julie", "Karoline",
  "Laila", "Malene", "Nadia", "Sigrid", "Tilde", "Asta",
  "Bente", "Dagmar", "Ebba", "Fanny", "Gertrud", "Hilda",

  // ── Polish ────────────────────────────────────────────────────────────────
  // Male
  "Krzysztof", "Wojciech", "Grzegorz", "Zbigniew", "Stanisław", "Tadeusz",
  "Andrzej", "Jerzy", "Ryszard", "Janusz", "Dariusz", "Mirosław",
  "Wiesław", "Bogdan", "Zdzisław", "Kazimierz", "Czesław", "Henryk",
  "Leszek", "Mariusz", "Artur", "Jacek", "Łukasz", "Bartosz",
  "Paweł", "Tomasz", "Marcin", "Maciej", "Kamil", "Dawid",
  "Piotr", "Michał", "Rafał", "Szymon", "Bartłomiej", "Dominik",
  "Kacper", "Mateusz", "Patryk", "Przemysław", "Radosław", "Sławomir",
  "Wójcik", "Zygmunt", "Aleksander", "Bogusław", "Cezary",
  "Edmund", "Feliks", "Gustaw", "Ignacy", "Juliusz", "Karol",
  "Leopold", "Mieczysław", "Norbert", "Olgierd", "Romuald",
  "Sylwester", "Tymoteusz", "Waldemar", "Witold", "Zenon",
  "Arkadiusz", "Bronisław", "Damian", "Eugeniusz", "Franciszek",
  "Hubert", "Ireneusz", "Jarosław", "Konrad", "Lucjan",
  "Miłosz", "Nikodem", "Oskar", "Maksymilian", "Błażej",
  "Cyprian", "Dobrosław", "Eryk", "Filip", "Gracjan",
  "Igor", "Jakub", "Kornel", "Ludwik", "Maurycy",
  "Olaf", "Rajmund", "Stefan", "Teodor", "Wacław",
  // Female
  "Katarzyna", "Małgorzata", "Agnieszka", "Jadwiga", "Bożena",
  "Grażyna", "Elżbieta", "Halina", "Iwona", "Jolanta",
  "Krystyna", "Lucyna", "Mirosława", "Renata", "Stanisława",
  "Teresa", "Urszula", "Wanda", "Zofia", "Aleksandra",
  "Barbara", "Celina", "Danuta", "Ewa", "Felicja",
  "Genowefa", "Helena", "Irena", "Justyna", "Karolina",
  "Lidia", "Magdalena", "Natalia", "Oliwia", "Paulina",
  "Róża", "Sylwia", "Tamara", "Violetta", "Weronika",
  "Zuzanna", "Adrianna", "Beata", "Czesława", "Dorota",
  "Emilia", "Franciszka", "Gabriela", "Honorata", "Izabela",
  "Joanna", "Kornelia", "Ludmiła", "Marlena", "Nikola",
  "Patrycja", "Sabina", "Tatiana", "Monika", "Aneta",
  "Bogusława", "Dominika", "Edyta", "Janina", "Kamila",
  "Marzena", "Wioletta", "Żaneta",

  // ── Malaysian / Malay ─────────────────────────────────────────────────────
  // Male
  "Ahmad", "Hafiz", "Ismail", "Amin", "Azman", "Farid", "Hakim",
  "Ibrahim", "Kamal", "Mahdi", "Nabil", "Rashid", "Saiful", "Tariq",
  "Yusuf", "Zainul", "Amirul", "Badrul", "Danial", "Faisal",
  "Ghazali", "Harith", "Izzat", "Jamal", "Khairul", "Luqman",
  "Mazlan", "Nazri", "Osman", "Qadir", "Ridwan", "Shafiq",
  "Umar", "Wan", "Yazid", "Zulkifli", "Anwar", "Bakar",
  "Dzulkarnain", "Farhan", "Hamid", "Idris", "Jalil", "Kamarul",
  "Latif", "Mustapha", "Nasir", "Razak", "Shahriman", "Taufik",
  "Wafi", "Zainal", "Arif", "Bukhari", "Ehsan", "Fikri",
  "Haris", "Imran", "Johari", "Khalid", "Lokman", "Musa",
  "Nazir", "Rahman", "Safwan", "Zahir", "Syahir", "Haziq",
  "Aiman", "Irfan", "Suffian", "Azhar", "Helmi", "Syafiq",
  // Female
  "Aisha", "Fatimah", "Nurul", "Siti", "Aminah", "Farah",
  "Hanisah", "Izzah", "Khadijah", "Laila", "Mariam", "Nadia",
  "Rahmah", "Safiya", "Yasmin", "Zainab", "Aishah", "Balqis",
  "Dahlia", "Fatin", "Hajar", "Intan", "Jamilah", "Khalidah",
  "Liyana", "Maisarah", "Najwa", "Puteri", "Rania", "Suhaila",
  "Tengku", "Wardah", "Zahra", "Adlina", "Batrisyia", "Damia",
  "Fitriah", "Hana", "Irdina", "Kamilia", "Lina", "Maryam",
  "Nadhirah", "Qistina", "Rozita", "Syahirah", "Umi", "Wafa",
  "Zulaikha", "Aina", "Balkis", "Dina", "Elina", "Farihah",
  "Hidayah", "Ilham", "Nadira", "Syarifah", "Atikah",
  "Husna", "Norshahida", "Rohana", "Suraya", "Norazlina",

  // ── American / English ────────────────────────────────────────────────────
  // Core names — these are extremely common and must always be caught,
  // even though Compromise.js theoretically handles them, it's inconsistent.
  "John", "James", "Robert", "Michael", "William", "David", "Richard",
  "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew",
  "Anthony", "Andrew", "Joshua", "Kenneth", "Steven", "Brian", "George",
  "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Scott",
  "Eric", "Stephen", "Larry", "Justin", "Raymond", "Gregory", "Samuel",
  "Benjamin", "Patrick", "Jonathan", "Peter", "Harold", "Douglas",
  "Henry", "Carl", "Arthur", "Gerald", "Keith", "Roger", "Albert",
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Susan",
  "Margaret", "Dorothy", "Lisa", "Nancy", "Sandra", "Betty", "Ashley",
  "Kimberly", "Donna", "Michelle", "Carol", "Amanda", "Melissa",
  "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
  "Kathleen", "Amy", "Angela", "Shirley", "Anna", "Brenda",
  "Pamela", "Catherine", "Christine", "Marie", "Janet", "Heather",
  "Teresa", "Sara", "Gloria", "Andrea", "Cheryl",
  // Modern / additional names Compromise.js often misses
  "Aiden", "Braxton", "Colton", "Declan", "Easton", "Finnegan",
  "Grayson", "Hudson", "Jaxon", "Keegan", "Landon", "Maverick",
  "Nash", "Oakley", "Preston", "Quincy", "Rowan", "Sawyer",
  "Tucker", "Weston", "Zander", "Ashton", "Beckett", "Camden",
  "Dalton", "Emerson", "Garrett", "Hayden", "Jensen", "Kendrick",
  "Lincoln", "Mitchell", "Nolan", "Parker", "Ryker", "Spencer",
  "Trenton", "Vance", "Wyatt", "Xavier", "Brody", "Caleb",
  "Derek", "Ethan", "Gavin", "Isaiah", "Jayden", "Kyle",
  "Logan", "Mason", "Nathan", "Owen", "Peyton", "Quinn",
  "Ryan", "Tyler", "Wesley", "Zachary", "Aaron", "Brandon",
  "Connor", "Dylan", "Evan", "Hayden", "Jordan", "Liam",
  "Noah", "Sean", "Trevor", "Austin", "Blake", "Cameron",
  "Dustin", "Elijah", "Hunter", "Jackson", "Kevin", "Lucas",
  "Morgan", "Nathaniel", "Paxton",
  // Female
  "Addison", "Brooklyn", "Chloe", "Delaney", "Emery", "Finley",
  "Gianna", "Hadley", "Isla", "Josie", "Kinsley", "Leighton",
  "Mackenzie", "Noelle", "Oaklyn", "Paisley", "Reagan", "Sutton",
  "Teagan", "Vivian", "Wren", "Ximena", "Zara", "Aubrey",
  "Brianna", "Charlotte", "Daisy", "Eleanor", "Gabrielle", "Hannah",
  "Isabella", "Jessica", "Kayla", "Lauren", "Megan", "Nicole",
  "Penelope", "Raelynn", "Samantha", "Taylor", "Vanessa", "Willow",
  "Abigail", "Bethany", "Caroline", "Diana", "Emily", "Fiona",
  "Hazel", "Irene", "Julia", "Katherine", "Lillian", "Madison",
  "Natalie", "Paige", "Rachel", "Sophia", "Tiffany", "Victoria",
  "Alexandra", "Brielle", "Cora", "Delilah", "Elena", "Genevieve",
  "Harper", "Ivy", "Juliette", "Keira", "Luna", "Mila",
  "Naomi", "Piper", "Scarlett", "Stella", "Amelia", "Aurora",

  // ── General International ─────────────────────────────────────────────────
  // Arabic
  "Mohammed", "Youssef", "Omar", "Ali", "Hassan", "Hussein",
  "Mustafa", "Salim", "Kareem", "Abdul", "Hamza", "Bilal",
  "Samir", "Rami", "Nour", "Leila", "Amira", "Samira",
  "Huda", "Dalia", "Lamia", "Rasha", "Mona",

  // Turkish
  "Mehmet", "Ahmet", "Emre", "Burak", "Cem", "Deniz",
  "Eren", "Hakan", "Kemal", "Murat", "Serkan", "Tolga",
  "Yilmaz", "Zeynep", "Ayşe", "Elif", "Fatma", "Gül",
  "Merve", "Selin", "Tugba", "Derya",

  // Indian / South Asian
  "Aarav", "Arjun", "Dhruv", "Gaurav", "Harsh", "Kiran",
  "Nikhil", "Pranav", "Rahul", "Sanjay", "Vikram", "Vivek",
  "Aditya", "Rohan", "Suresh", "Rajesh", "Deepak", "Amit",
  "Priya", "Ananya", "Divya", "Kavita", "Lakshmi", "Meera",
  "Neha", "Pooja", "Ritu", "Shreya", "Sunita", "Swati",
  "Tanvi", "Anjali", "Isha", "Pallavi",

  // Chinese (romanized / pinyin)
  "Wei", "Jing", "Xiao", "Yong", "Ming", "Hui",
  "Liang", "Hao", "Tao", "Chen", "Fang",
  "Mei", "Ying", "Xin", "Yan", "Ling",

  // Japanese (romanized)
  "Akira", "Daichi", "Haruto", "Kenji", "Naoki", "Riku",
  "Takeshi", "Yuto", "Satoshi", "Hiroshi", "Kazuki", "Shinji",
  "Sakura", "Yuki", "Hana", "Aoi", "Rin", "Miku",
  "Kaori", "Yumiko", "Haruka",

  // Korean (romanized)
  "Minho", "Jisoo", "Seongjin", "Hyunwoo", "Jihoon",
  "Eunji", "Soojin", "Minji", "Yuna", "Chaewon",

  // Vietnamese
  "Minh", "Tuan", "Hieu", "Trung", "Duc", "Thanh",
  "Linh", "Huong", "Thuy", "Trang", "Anh",

  // African
  "Kwame", "Kofi", "Abena", "Adjoa", "Amadi", "Chidi",
  "Emeka", "Ngozi", "Obiora", "Nneka", "Oluwaseun",
  "Chioma", "Adebayo", "Olumide",

  // Nordic / Scandinavian (non-Danish)
  "Ingrid", "Gunhild", "Arvid", "Einar", "Sven",
  "Torbjörn", "Annika", "Linnea", "Elsa",

  // Latin American / Spanish
  "Alejandro", "Carlos", "Diego", "Eduardo", "Fernando",
  "Gonzalo", "Javier", "Miguel", "Pablo", "Rafael",
  "Santiago", "Valentina", "Camila", "Daniela", "Fernanda",
  "Gabriela", "Lucia", "Mariana", "Valeria", "Ximena",

  // Portuguese / Brazilian
  "Bernardo", "Caio", "Guilherme", "Henrique", "Matheus",
  "Thiago", "Beatriz", "Larissa", "Leticia", "Manuela",

  // French
  "Antoine", "Baptiste", "Cédric", "Didier", "Étienne",
  "François", "Gaspard", "Hervé", "Jacques", "Laurent",
  "Mathieu", "Nicolas", "Olivier", "Philippe", "Quentin",
  "Romain", "Sébastien", "Thierry", "Yves", "Amélie",
  "Brigitte", "Céline", "Dominique", "Élodie", "Geneviève",
  "Hélène", "Isabelle", "Juliette", "Léonie", "Madeleine",
  "Noémie", "Colette", "Sylvie", "Véronique",

  // German / Austrian
  "Dieter", "Friedrich", "Günter", "Helmut", "Jürgen",
  "Karl", "Lothar", "Manfred", "Rainer", "Siegfried",
  "Thorsten", "Werner", "Wolfgang", "Uwe", "Detlef",
  "Bernd", "Annegret", "Bärbel", "Christiane", "Dagmar",
  "Elfriede", "Friederike", "Gisela", "Hannelore", "Ingeborg",
  "Kerstin", "Lieselotte", "Marlene", "Renate", "Sabine",
  "Susanne", "Ulrike", "Waltraud",

  // Eastern European (other)
  "Dmitri", "Andrei", "Sergei", "Yuri", "Oleg",
  "Svetlana", "Tatiana", "Natasha", "Olga", "Katya",
  "Irina", "Anastasia", "Maksim", "Pavel", "Nikolai",
  "Vladimir", "Boris", "Pyotr", "Ekaterina",
]);


// ─── Ambiguous Names ────────────────────────────────────────────────────────
// These are real names that also function as common English words.
// Only flagged when followed by another capitalized word (surname heuristic).

const AMBIGUOUS_NAMES = new Set([
  // English words that are also names
  "Art", "Barb", "Bill", "Bob", "Buck", "Bud", "Carol",
  "Chase", "Chip", "Clay", "Cliff", "Cole", "Dale", "Dawn",
  "Dean", "Don", "Duke", "Earl", "Faith", "Fern", "Ford",
  "Gene", "Glen", "Grace", "Grant", "Guy", "Hank", "Herb",
  "Hope", "Ivy", "Jack", "Jade", "Jay", "Jean", "Jewel",
  "Jim", "Joe", "Joy", "June", "King", "Kit", "Lance",
  "Lee", "Lily", "Mac", "Marc", "Mark", "Mat", "Max",
  "Mick", "Mike", "Misty", "Ned", "Neil", "Nick", "Norm",
  "Pat", "Pearl", "Penny", "Phil", "Prince", "Ray", "Red",
  "Rex", "Rich", "Rick", "Rob", "Rod", "Roger", "Rose",
  "Roy", "Ruby", "Russ", "Ruth", "Sandy", "Skip", "Slim",
  "Sonny", "Stan", "Sterling", "Steve", "Sue", "Sunny",
  "Tab", "Ted", "Terry", "Tim", "Tom", "Troy", "Ty",
  "Val", "Vic", "Wade", "Walt", "Ward", "Will", "Woody",
  "Beau",

  // Danish/Nordic names that are also words
  "Dag",   // "day" in Scandinavian, but rare in English context
  "Bo",    // short and common syllable
  "Kim",   // unisex, common word boundary issues
  "Stig",  // could be "stig" rarely

  // Polish names that are also common words
  "Jan",   // month abbreviation in English
  "Roman", // the adjective/noun
  "Leon",  // less ambiguous but short

  // Malay names that might clash
  "Wan",   // common word
  "Adi",   // could be abbreviation

  // Short international names
  "Ali",   // very common, also English "ali" fragments
  "Raj",   // short
  "Sam",   // common word/abbreviation
  "Ben",   // common word
  "Dan",   // common word
  "Ken",   // common word
  "Hal",   // common abbreviation (HAL)
  "Ian",   // short, usually safe but listed for caution
  "Ray",   // beam of light
]);
