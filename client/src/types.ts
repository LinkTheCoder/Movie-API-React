export interface Movie {
  id: number
  title: string
  year: number
  duration: number
  genre: string
}

export interface Genre {
  id: number
  name: string
}

export interface MovieInput {
  title: string
  year: number
  duration: number
  genreId: number
}

export interface Actor {
  id: number
  name: string
  birthYear: number
}

export interface Review {
  id: number
  reviewerName: string
  comment: string
  rating: number
}

export interface ReviewInput {
  reviewerName: string
  comment: string
  rating: number
}

export interface MovieDetails {
  synopsis: string
  language: string
  budget: number
}

export interface MovieDetail {
  id: number
  title: string
  year: number
  duration: number
  genre: string
  details: MovieDetails | null
  reviews: Review[]
  actors: Actor[]
}
