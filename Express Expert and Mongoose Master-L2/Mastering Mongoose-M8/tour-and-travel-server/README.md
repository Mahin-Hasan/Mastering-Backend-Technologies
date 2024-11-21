# tour and travel server

- project flow and DB estimation
## Three model - User - Tour - Review
user {
    name
    email
    age
    photo
    role -> user, admin
    status -> active, inactive
}

tour {
    name
    duration
    rating
    price
    coverImage
    image[]
    startDate
    tourLocation
}

review {
    review
    rating
    tour -> ref
    user -> ref
}