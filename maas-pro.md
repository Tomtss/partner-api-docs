---
layout: page
title: Maas Pro
permalink: /maas-pro/
---
# Introduction

This documentation is outlining the available API’s for a mobility partner to integrate into Voi’s vehicle rental service.

# Authentication

```shell
curl "https://partners.voiapp.io/v1/...
  -H "X-Auth-Token: $TOKEN"
```

API endpoints available for the mobility partner, are protected with token authentication using the key `X-Auth-Token` in the request header with the token you received from Voi when signing up.

If you are interested in using our API please contact us at [api@voiapp.io](mailto:api@voiapp.io).
## Header Parameters

Key | Value
--------- | -----------
X-Auth-Token |  your-token

<aside class="warning">For authentication using the MDS and GBFS API, please see the specific documentation <a href="#mds">here</a>.</aside>

# User

This section describes the possible interactions with the user domain of the API.

## User model
> The user response model.

```shell
{
  "data": {
    "id": "9b39971c-8e51-5b32-aa07-dd2fee64c2b0",
    "type": "user",
    "attributes": {
      "email": "example@mail.com",
      "firstName": "Agatha",
      "lastName": "Christie" ,
      "phoneNumber: "+441234345",
      "externalId": "12345678-abcd-0000-1111-1234567890ab"
    }
  }
}
```

All successful user interactions responds with the following user model.

field | type | description | presence
------ | -------- | -------- | -------
id | string | The unique id for the user (UUID Version 4)| required
type | string | The type will be "user"| required
email | string | The user's email address| required
firstName | string |The user's first name | optional
lastName | string | The user's last name| optional
phoneNumber | string | The user's phone number| optional
externalId | string |  The user's id created in the API consumers own system| optional


## Register user

Register user creates a new user with a unique user id. A user is required to be registered before a rental can be started.

<aside class="warning">There are no uniqueness constraints on any of the provided parameters, so idempotency is not guaranteed. Two identical requests to register user will create two separate users with two different user id's</aside>

### HTTPS request
`POST https://partners.voiapp.io/v1/user/register`

### Post data

field | type | description | presence
------ | -------- | -------- | -------
email | string | The user's email address| required
firstName | string |The user's first name | optional
lastName | string | The user's last name| optional
phoneNumber | string | The user's phone number| optional
externalId | string |  The user's id created in the API consumers own system| optional
paymentToken | string |  The payment token for the users payment solution| optional

<aside class="warning">Voi doesn't recommend integrating support for payment providers through Voi API. The support for the partners specific payment provider is therefor not guaranteed. Please contact Voi for more information.</aside>

## Get user

> A get user request.

```shell
curl https://partners.voiapp.io/v1/users/9b39971c-8e51-5b32-aa07-dd2fee64c2b0
  -H "X-Auth-Token $TOKEN"
```

> A get user response.

```shell
{
  "data": {
    "id": "9b39971c-8e51-5b32-aa07-dd2fee64c2b0",
    "type": "user",
    "attributes": {
      "email": "example@mail.com",
      "firstName": "Agatha",
      "lastName": "Christie" ,
      "phoneNumber: "+441234345",
      "externalId": "12345678-abcd-0000-1111-1234567890ab"
    }
  }
}
```


Get user by its user id

### HTTPS request
`GET https://partners.voiapp.io/v1/user/id/{id}`

### Path parameters

parameter  | description | presence
------ | -------- | -------
id |  the user id (UUID version 4) | required

# Rental
This section describes the possible interactions with the rental domain of the API.

## Rental model
> The rental response model.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "attributes": {
                "rentalDurationMin": 12,
                "cost": {
                    "total": {
                        "amount": 280,
                        "currency": "EUR",
                        "vat": 53
                    }
                },
                "state": "ENDED",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "endedAt": "2020-01-13T16:13:20.44314233Z",
                "userStartLocation": {
                    "longitude": 18.07571600306901,
                    "latitude": 59.319013004372512
                },
                "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
                "vehicleEndLocation": {
                    "longitude": 18.07571600384931,
                    "latitude": 59.319013004374841
                }
            }
        }
    ]
}
```
All successful rental interactions responds with the following rental model.

field | type | description | presence
------ | -------- | -------- | -------
id | string | The rental's unique id (UUID Version 4)| required
type | string | The type will be "rental"| required
rentalDurationMin | integer | The rental's duration, rounded up, in minutes| required
cost | object | Contains rental's cost information | required
total | object | Contains the rental's total cost | required
amount | integer | The rental's amount in minor units (also called subunit)| required
currency | string | The rental's alphabetic currency code (ISO 4217) | required     
vat | integer | The rental's VAT amount in minor units (also called subunit) | required       
state |   string   |  The current state of the rental ("RUNNING" or "ENDED")      | required               
startedAt | string     |  Time when the rental started (RFC3339 in UTC) | required           
endedAt |  string    |   Time when the rental ended (RFC3339 in UTC)      | optional             
vehicle |  object    |  Contains information about the vehicle used in the rental      | required  
vehicleCode |  string    |  The vehicle's unique code, visible on the physical vehicle | required  
vehicleId |  string    |  The vehicle's unique id (UUID Version 4)| required             
userStartLocation |  object    | The start location provided by the user     | optional   
userEndLocation | object | The end location provided by the user | optional    
vehicleStartLocation | object     | The vehicle’s start location      | required
vehicleEndLocation | object     |  The vehicle’s end location      | optional  
longitude | number | The longitude component in a location | required (if parent object is present)
latitude | number | The latitude component in a location | required (if parent object is present)


<aside class="warning">The <code>amount</code> is always in <b>minor units</b>. In most currencies the relation between the major unit and the minor unit is 1/100.<br>
<b>Example:</b> In the currency euro (EUR), 100 of the minor unit cent corresponds with one major unit of EUR. <br>
12.13 euro is sent as <code>{"amount": 1213, "currency": "EUR"}</code> </aside>


## Start rental

> A start rental request.

```shell
curl -X POST https://partners.voiapp.io/v1/rental/start
  -H "X-Auth-Token: $TOKEN"
  -d "{
           "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
           "userId": "c03418b3-004e-47cb-931c-36c2b0dc110a"
           "userStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
           }
      }"
```

> A start rental response.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "attributes": {
                "rentalDurationMin": 0,
                "cost": {
                    "total": {
                        "amount": 0,
                        "currency": "SEK",
                        "vat": 0
                    }
                },
                "state": "RUNNING",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "userStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude":  59.319013004372515
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
            }
        }
    ]
}
```
Start rental makes a vehicle accessible to ride with. To request to start a rental, the `userId` and `vehicleId` are provided in the request body.

### HTTPS request

`POST https://partners.voiapp.io/v1/rental/start`

### JSON body data

field | type | description | presence
------ | -------- | -------- | -------
userId | string | The id of the user for whom the rental is started | required
vehicleId | string | The id of the vehicle which will be rented| required
userStartLocation | string | The user’s location when starting the rental| optional


## End rental

End rental locks the vehicle and makes it available for other users to use. The partner typically initiates the payment process when ending the rental .

When the rental has ended the total cost of the rental is return in the end rental response. 

> An end rental request.

```shell
curl -X POST https://partners.voiapp.io/v1/rental/82267e03-f5b1-4b76-86c6-9f07df279372/end
  -H "X-Auth-Token: $TOKEN"
  -d "{
           "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
           }
      }"
```

> An end rental response.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "attributes": {
                "rentalDurationMin": 12,
                "cost": {
                    "total": {
                        "amount": 280,
                        "currency": "EUR",
                        "vat": 53
                    }
                },
                "state": "ENDED",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "endedAt": "2020-01-13T16:13:20.44314233Z",
                "userStartLocation": {
                    "longitude": 18.07571600306901,
                    "latitude": 59.319013004372512
                },
                "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
                "vehicleEndLocation": {
                    "longitude": 18.07571600384931,
                    "latitude": 59.319013004374841
                }
            }
        }
    ]
}
```
### HTTPS request
`POST https://partners.voiapp.io/v1/rental/<rentalId>/end`

### Path parameters

parameter  | description
------ | -------- | -------
rentalId |  The id of the rental that is to be ended 

### Post data

field | type | description | presence
------ | -------- | -------- | -------
userEndLocation | string | The user’s location when ending the rental | optional



## Rental by id

```shell
curl https://partners.voiapp.io/v1/rental/82267e03-f5b1-4b76-86c6-9f07df279372
  -H "Authorization: Bearer $TOKEN"

```
### HTTPS request
`GET https://partners.voiapp.io/v1/rental/<id>`

### Path parameters

parameter  | description
------ | -------- | -------
id |  The rental id of the requested rental

##  Active rental by user 

> A get users active rental request.

```shell
curl https://partners.voiapp.io/v1/rental/user/82267e03-f5b1-4b76-86c6-9f07df279372/active
  -H "Authorization: Bearer $TOKEN"

```

### HTTPS request
`GET https://partners.voiapp.io/v1/rental/user/<id>/active`

### Path parameters

parameter  | description
------ | -------- | -------
id |  The user id for the requested rental




## Rentals by user

```shell
curl https://partners.voiapp.io/v1/rental/user/82267e03-f5b1-4b76-86c6-9f07df279372
  -H "Authorization: Bearer $TOKEN"

```
### HTTPS request
`GET https://partners.voiapp.io/v1/rental/user/<id>`

### Path parameters

parameter  | description
------ | -------- | -------
id |  The user id for the requested rentals

# Pricing
## Pricing model
> The vehicle response model.

```shell
{
  "data": {
    "type": "pricing",
    "id": "12345678-1337-abcd-1234-1234abcd0002",
    "attributes": {
      "currency": "EUR",
      "pricePerMinute": 15,
      "startPrice": 100,
      "vat": 19
    }
  }
}
```

All successful pricing interactions responds with the following pricing model.

field | type | description | presence
------ | -------- | -------- | -------
id | string | The vehicle's id (UUID version 4) for which the pricing is derived | required
type | string | For pricing the type will always be "pricing"  | required
pricePerMinute | integer | the price per minute in minor units (also called subunit)| required
startPrice | integer | the start price in minor units (also called subunit)| required
currency | string | the three letter alphabetic currency code (ISO 4217) | required     
vat | integer | the VAT percentage  | required  

## Get price

> A get pricing request.

```shell
curl https://partners.voiapp.io/v1/pricing/vehicle/12345678-1337-abcd-1234-1234abcd0002
  -H "X-Auth-Token: $TOKEN"
```
> A get pricing response.

```shell
{
  "data": {
    "type": "pricing",
    "id": "12345678-1337-abcd-1234-1234abcd0002",
    "attributes": {
      "currency": "EUR",
      "pricePerMinute": 15,
      "startPrice": 100,
      "vat": 19
    }
  }
}
```

Pricing information can be accessed for a particular vehicle by referencing the vehicle’s id.

### HTTPS request
GET https://partners.voiapp.io/v1/pricing/vehicle/{id} 

### Path parameters

parameter | description | presence
------|--------- | -----
id | The vehicle id (UUID version 4). | required

# Vehicle
This section describes the possible interactions with the vehicle domain of the API.

## Vehicle model
> The vehicle response model.

```shell
{
  "data": [
    {
      "type": "vehicle",
      "id": "12345678-1337-abcd-1234-1234abcd0001",
      "attributes": {
        "batteryLevel": 95,
        "location": {
            "latitude": 47.213553,
            "longitude": 17.382606,
         },
        "code": "L33T",
      }
    },
  ]
}
```

All successful vehicle interactions responds with the following vehicle model.

field | type | description | presence
------ | -------- | -------- | -------
id | string | The vehicle's id (UUID version 4) | required
type | string | For vehicles the type will always be "vehicle"  | required
batteryLevel | integer | The state of charge of the vehicle in percent (0-100)| required
location | object | The vehicle’s location| required
longitude | number | the longitude component in a location | required 
latitude | number | the latitude component in a location | required 
code | string |  the vehicle code, visually available on the vehicle | required

## Get vehicles by zone
> A get vehicles by zone request.

```shell
curl https://partners.voiapp.io/v1/vehicles/?zoneID=9
  -H "X-Auth-Token: $TOKEN"
```
> A get vehicles by zone response.

```shell
{
  "data": [
    {
      "type": "vehicle",
      "id": "12345678-1337-abcd-1234-1234abcd0001",
      "attributes": {
        "batteryLevel": 95,
        "location": {
            "latitude": 47.213553,
            "longitude": 17.382606,
         },
        "code": "L33T",
      },
      {
      "type": "vehicle",
      "id": "12345678-1337-abcd-1234-1234abcd0002",
      "attributes": {
        "batteryLevel": 86,
        "location": {
            "latitude": 48.213553,
            "longitude": 16.382606,
        },
        "code": "D0IT",
      }
    },
  ]
}
```

To be able to start a rental or get pricing, the vehicle which is subject for the rental or the pricing needs to be referenced with its id. 
To discover the set of vehicles available for rental, the zone id needs to be provided. 
Only vehicles available for rental will be part of the response.


### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/?zoneID={zoneID}`

### Query parameters

parameter  | description | presence
------ | -------- | -------
zoneID |  The id of the requested zone | required

<aside class="warning">The zones that can be accessed may be limited.</aside> 


## Get Vehicle by code
> A get vehicle by code request.

```shell
curl https://partners.voiapp.io/v1/vehicles/code/L33T
  -H "X-Auth-Token: $TOKEN"
```
> A get vehicle by code response.

```shell
{
  "data": [
      {
         "type": "vehicle",
         "id": "12345678-1337-abcd-1234-1234abcd0001",
         "attributes": {
           "batteryLevel": 95,
           "location": {
               "latitude": 47.213553,
               "longitude": 17.382606,
            },
           "code": "L33T",
         }
    },
  ]
}
```

### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/code/{code}`

### Path parameters

parameter  | description | presence
------ | -------- | -------
code |  the vehicle code, visually available on the vehicle | required

## Get Vehicle by id

> A get vehicle by id request.

```shell
curl https://partners.voiapp.io/v1/vehicles/id/12345678-1337-abcd-1234-1234abcd0002
  -H "X-Auth-Token: $TOKEN"
```
> A get vehicle by id response.

```shell
{
  "data": [
      {
      "type": "vehicle",
      "id": "12345678-1337-abcd-1234-1234abcd0002",
      "attributes": {
        "batteryLevel": 86,
        "location": {
            "latitude": 48.213553,
            "longitude": 16.382606,
        },
        "code": "D0IT",
      }
    },
  ]
}
```
### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/id/{id}`

### Query parameters

parameter  | description | presence
------ | -------- | -------
id |  The vehicle's id (UUID version 4)  | required

# Zone

## Get zone areas

> The zones response model.

```shell
{
  "data": {
    "id": "1",
    "type": "area",
    "attributes": {
      "areas": [
        {
          "area_type": "no-parking",
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [
                    18.04053783416748,
                    59.33789244534906
                  ],
                  [
                    18.04053783416748,
                    59.33789244534906
                  ]
                ]
              ]
            ]
          }
        },
        {
          "area_type": "slow-zone",
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [
                    10.732870101928711,
                    59.949568270842
                  ],
                  [
                    10.732870101928711,
                    59.949568270842
                  ]
                ]
              ]
            ]
          }
        }
      ]
    }
  }
}
```

To able to display the correct zone information in a provider app, the geolocation of objects such as no-parking areas, slow areas, and operational areas can be received using the get zones endpoint.

### Supported Areas
area type  | Description
------ | -------- 
operations |  The operational area, where Voi operates
no-parking |  An area where a rental can't be ended
parking-spot |   An area where a rental must be ended
slow-zone |  An area where a vehicle's max-speed will be lowered


For a zone with parking-spot areas, vehicles are only allowed to be parked within the parking-spot areas.
<br>For a zone with no-parking areas, vehicles are allowed to be parked anywhere within the operational area except in the no-parking areas.
<aside class="warning"> A zone can either have <b>parking-spot</b> areas or <b>no-parking</b> areas but not both. They are mutually exclusive.</aside> 

### HTTPS request

`GET https://partners.voiapp.io/v1/zone/id/<zoneId>`

### Path parameters

parameter  | description
------ | -------- | -------
zoneId |  The id of the requested zone

<aside class="warning">All behavior connected to the areas in a zone are enforced by the system. But for a good user experience, we recommend explaining the areas and their implication for the user.</aside> 

### Response
 
field | type | description | presence
------ | -------- | -------- | -------
id | string | The zone id for the requested areas  | required
type | string | For zones the type will always be "area"  | required
area_type | string | The area type (one of the supported area types)| required
geometry | object | Describes the geometry for the area (geoJSON)| required

