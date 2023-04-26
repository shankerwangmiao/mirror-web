require 'execjs'

module Jekyll
    module Converters
      class ZHelpMdx < Converter
        safe true
        priority :low
  
        DEFAULT_CONFIGURATION = {
          'zhelpmdx_extensions' => 'mdx'
        }
  
        def initialize(config = {})
            @config = Jekyll::Utils.deep_merge_hashes(DEFAULT_CONFIGURATION, config)
        end
  
        def matches(ext)
            extname_list.include? ext.downcase
        end
  
        def output_ext(ext)
            ".html"
        end
  
        def source_path
            File.expand_path("..", __FILE__)
        end

        def script_path
            File.join(source_path, 'zhelpmdx.js')
        end

        def context
            @context ||= ExecJS.compile("var self = this; var console={}; " + File.read(script_path))
        end
        
        def convert(content)
            context.call("zhelpmdx.default", content)
        rescue Exception => e
            print e.message + "\n"
            print e.backtrace.join("\n")
            raise e
        end
  
        private
  
        def extname_list
            @extname_list ||= @config['zhelpmdx_extensions'].split(',').map { |e| ".#{e.downcase.strip}" }
        end
      end
    end
end
