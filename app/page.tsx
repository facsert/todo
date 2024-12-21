"use client"

import { useState, useEffect } from 'react';
import { 
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandShortcut
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Trash2, PenLine  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"

class Task {
  constructor(
    public id: Date = new Date(),
    public title: string = "",
    public content: string = "",
    public done: boolean = false,
  ) {}
}

type Filter = 'all' | 'done' | 'undone'



export default function Home() {
  const [tempTask, setTempTask] = useState<Task>(new Task());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  
  useEffect(() => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      setTasks(JSON.parse(tasks));
    } else {
      setTasks([
        { id: new Date(), title: '吃饭', content: '去吃饭', done: false },
        { id: new Date(), title: '睡觉', content: '去吃饭', done: false },
        { id: new Date(), title: '编程', content: '去吃饭', done: false },
      ]);
    }
  }, []);

  const switchTask = (id: Date) => {
    const newTasks =tasks.map(task => task.id === id? {...task, done: !task.done} : task)
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  const addTask = (formData: FormData) => {
    setTasks([...tasks, {
      id: new Date(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      done: false
    }]);
    toast.success('添加成功');
  }

  const deleteTask = (id: Date) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  const editTask = () => {
    setTasks(tasks.map(task => task.id === tempTask.id? {...task, ...tempTask} : task))
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO LIST ({tasks.filter(task => !task.done).length}/{tasks.length})
        </h1>
      </div>

      <ToggleGroup type='single' size="lg" className='grid grid-cols-3 gap-0'>
        <ToggleGroupItem value="all" onClick={() => setFilter('all')}>全部</ToggleGroupItem>
        <ToggleGroupItem value="done" onClick={() => setFilter('done')} >完成</ToggleGroupItem>
        <ToggleGroupItem value="undone" onClick={() => setFilter('undone')}>未完成</ToggleGroupItem>
      </ToggleGroup>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost"> + 添加任务</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Todo</DialogTitle>
            <form action={addTask}>
              <Label>Title</Label>
              <Input name="title" />
              <Label>Content</Label>
              <pre>
                <Textarea name="content" />
              </pre>
              <div>
                <Button type="submit" variant="ghost">添加</Button>
                <DialogClose>关闭</DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Command>
          <CommandInput></CommandInput>
          <CommandList>
            <CommandEmpty>空</CommandEmpty>
            {tasks.filter(task => filter === 'all' || (filter === 'done' && task.done) || (filter === 'undone' && !task.done)).map((task, index) => (
              <CommandItem key={index} onSelect={() => null}>
                <Checkbox className="mr-2" checked={task.done} onCheckedChange={() => {switchTask(task.id)}} />  
                <Label className={task.done? "line-through": ""}>
                  {task.title}
                </Label>
                <CommandShortcut className="h-full flex flex-row items-center gap-0">
                  <Dialog >
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={() => setTempTask(task)}>
                        <PenLine className="mr-2 h-6 w-6" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                      </DialogHeader>
                      
                      <form action={editTask}>
                        <Label>Title</Label>
                          <Input name="title" value={tempTask.title} onChange={(e) => setTempTask({...tempTask, title: e.target.value})} />
                        <Label>Content</Label>
                        <Textarea name="content" value={tempTask.content} onChange={(e) => setTempTask({...tempTask, content: e.target.value})} />
                        
                        <DialogFooter>
                          <Button type="submit" variant="ghost">保存</Button>
                        </DialogFooter>
                        <div>
                          <Button type="submit" variant="ghost">保存</Button>
                          <DialogClose>关闭</DialogClose>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
