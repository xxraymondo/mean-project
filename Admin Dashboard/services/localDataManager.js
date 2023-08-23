class LocalDataManager{
    #localStoarge;
    #string;
    #prefix;
    #ignorePrefix;
   /**
   * create instance of LocalDataManager.
   * @constructor
   * @param {string} prefix - A value to be added before each key 
   * @example prefix = "x"; key = "x"+"-"+key; 
   */ 
    constructor(prefix){
        this.#localStoarge = window.localStorage;
        this.#string = "string";
        this.#prefix = prefix;
        this.#ignorePrefix = this.#prefix? false:true;
    }
    /**
     * @function
     * @param {string} key 
     * @param {object|Aarry|Map|Set} obj simple object without functions
     * @example {name:"John", age:40}
     */
    saveObject(key, obj){
        this.#validateKey(key);
        this.#localStoarge.setItem(`${this.#getKey(key)}`, JSON.stringify(obj));
    }
    saveValue(key, value){
        this.#validateKey(key);
         this.#localStoarge.setItem(`${this.#getKey(key)}`, `${value}`);
    }

    getObject(key){
        this.#validateKey(key);
        return JSON.parse(this.#localStoarge.getItem(this.#getKey(key)));
    }
    getString(key){
        this.#validateKey(key);
        return this.#localStoarge.getItem(this.#getKey(key));
    }
    getNumber(key){
        this.#validateKey(key);
        return Number(this.getString(this.#getKey(key)));
    } 
    remove(key){
        this.#validateKey(key);
        this.#localStoarge.removeItem(this.#getKey(key));
    }
   /**
   * This Function for igoring adding the prifix value to the kays
   * @function
   * @param {bool} igonrePrefix - false will add the prefix value to the key.
   */ 
    setIgnorPrefix(igonrePrefix){
        if(typeof igonrePrefix != "boolean") throw("Boolean parameter is required for the function setIgnorPrefix()");
        if(!this.#prefix && !igonrePrefix) throw("the value of prefix is required, call the method setPrefix() and set prefix first.");
        this.#ignorePrefix = igonrePrefix;
    }

   /**
   * @function
   * @param {string} prefix - the value to be added before the key.
   * @example prefix = "x"; key = "x"+"-"+key; 
   */
    setPrefix(prefix){
        this.#validateKey(prefix);
        this.#prefix = prefix;
    }
    #validateKey(key){
        if(typeof key !=  this.#string) throw("You have enterd non-String key");
        if(!key || key.match(/^ *$/)) throw("You have enterd invalid key or");
        return key;
    }

    #getKey(key){
        if(!this.#prefix || this.#ignorePrefix) return key;
        return `${this.#prefix}-${key}`;
    }
}

let dm = new LocalDataManager();