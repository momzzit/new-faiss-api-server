import { useState, ChangeEvent } from 'react'
import { Toaster } from 'sonner'
import { SearchResult } from './types'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">NewsQuest</h1>
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search news articles..."
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="grid gap-6">
          {results.map((result) => (
            <div key={result.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
              <p className="text-gray-600">{result.content}</p>
              <div className="mt-4 text-sm text-gray-500">
                Similarity: {(result.similarity * 100).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App 