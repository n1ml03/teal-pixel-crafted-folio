import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  Tag
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navigation from '@/components/playground/Navigation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { tutorials, Tutorial } from '../../data/tutorials';

const Tutorials = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Get unique categories and difficulties for filters
  const categories = Array.from(new Set(tutorials.map((tutorial: Tutorial) => tutorial.category))) as string[];
  const difficulties = Array.from(new Set(tutorials.map((tutorial: Tutorial) => tutorial.difficulty))) as string[];

  // Filter tutorials based on search query and filters
  const filteredTutorials = tutorials.filter((tutorial: Tutorial) => {
    const matchesSearch = searchQuery.trim() === '' ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = difficultyFilter === null || tutorial.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === null || tutorial.category === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });



  // Clear all filters
  const clearFilters = () => {
    setDifficultyFilter(null);
    setCategoryFilter(null);
    setSearchQuery('');
  };

  // Get tutorial progress for the current user
  const getTutorialProgress = (_tutorialId: string): number => {
    // In a real app, this would come from the user's progress data
    // For now, return random progress for demonstration
    return Math.floor(Math.random() * 101);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="container flex-1 py-6 pt-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tutorials</h1>
          <p className="text-muted-foreground">
            Step-by-step guides to help you master the Testing Playground
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutorials..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {difficultyFilter ? `Difficulty: ${difficultyFilter}` : 'Difficulty'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDifficultyFilter(null)}>
                  All Difficulties
                </DropdownMenuItem>
                {difficulties.map((difficulty: string) => (
                  <DropdownMenuItem
                    key={difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                  >
                    {difficulty}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Tag className="h-4 w-4" />
                  {categoryFilter ? `Category: ${categoryFilter}` : 'Category'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category: string) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {(difficultyFilter !== null || categoryFilter !== null || searchQuery !== '') && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial: Tutorial, index: number) => {
            const progress = getTutorialProgress(tutorial.id);
            const isCompleted = progress === 100;

            return (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{tutorial.title}</CardTitle>
                      {isCompleted && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{tutorial.difficulty}</Badge>
                      <Badge variant="outline">{tutorial.category}</Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {tutorial.duration}
                      </Badge>
                    </div>

                    {user && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/playground/tutorials/${tutorial.id}`)}
                    >
                      {isCompleted ? 'Review Tutorial' : 'Start Tutorial'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tutorials found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
