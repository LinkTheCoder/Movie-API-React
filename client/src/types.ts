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
