class Services {
    #token;
    #baseUrl;
    constructor(){
        this.#token = dm.getString('authToken');
        this.#baseUrl = "http://localhost:3000/"
    }
    setBaseUrl(baseUrl){
        this.#baseUrl = baseUrl;
    }
    setToken(token){
        this.#token = token;
    }


    async postRequest(api, body){
        let requestBody = body??{};
        console.log(requestBody);
        const response = await fetch(`${this.#baseUrl}${api}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${this.#token}`
        },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw 401;
      } else {
        console.log("error1");
      }
    }
    const data = await response.json()
    return data;
    }

    async putRequest(api, body){
        let requestBody = body??{};
        const response = await fetch(`${this.#baseUrl}${api}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${this.#token}`
        }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw 401;
      } else {
        console.log("error1");
      }
    }
    const data = await response.json()
    return data;
    }

    async getRequest(api, params) {
        let url = `${this.#baseUrl}${api}`;
        if (params != null) {
          url = `${url}?${new URLSearchParams(params)}`;
        }
        // console.log(url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${this.#token}`
          }
        });
      
        if (!response.ok) {
          if (response.status === 401) {
            throw 401;
          } else {
            console.log("error1");
          }
        }
      
        const data = await response.json();
        return data;
      }
}

let services = new Services();